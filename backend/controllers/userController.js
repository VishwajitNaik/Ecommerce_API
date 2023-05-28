const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const { ErrorHandler } = require('../utils/errorhandler');
const User = require('../models/userModel');
const { model } = require('mongoose');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Register a user
const registerUser = catchAsyncErrors(async(req,res,next)=>{
    const {name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: "this is a sample id",
            url: "profilepicUrl",
        },
    });
    sendToken(user, 201, res);
})

//Login User 
const loginUser = catchAsyncErrors(async(req,res,next)=>{
    const {email,password} = req.body;
    // checking if user has  given password and email both

    if(!email || !password){
        return next(new ErrorHandler("Invalid email or password", 400))
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    const ispasswordMatched = user.compairedPassword(password); 

    if(!ispasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

sendToken(user, 200, res);

});


// Logout User 

const logout = catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token", null,{
        expires: new Date(Date.now()),
        httpOnly: true,

    });
    res.status(200).json({
        success: true,
        message: "Logged out",

    });
});

// forgot password

const forgotPassword = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findOne({email: req.body.email});
        if(!user){
            return next(new ErrorHandler("User not found ", 404));
        }

    // Get Reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});
    
    const resetPasswordUrl = `${req.protocol}://${req.get(
        "host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is:- \n\n ${resetPasswordUrl} \n\n if you have not requested this email then ignore it`;


    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password recovery`,
            message,
        });
        res.status(200).json({
            success:true,
            message: `Email sent to ${user.email} success.....`,
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message, 500));
    }
});

//Resete Password

const resetPassword = catchAsyncErrors(async(req,res,next)=>{
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {$gt: Date.now()},
});

if(!user){
    return next(new ErrorHandler("Reset Password Token is invalid ", 404));
}

user.password = req.body.password;
user.resetPasswordToken = undefined;
user.resetPasswordExpire = undefined;

await user.save();

sendToken(user, 200, res);

});


// get user details
const getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    });
})

// update User password 
const updatePassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");

    const ispasswordMatched = await user.compairedPassword(req.body.oldPassword);

    if(!ispasswordMatched){
        return next(new ErrorHandler("Old password is incorrect ", 400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("confirm password does not matched ", 400));    
    }

    user.password = req.body.newPassword;

    user.save()

    sendToken(user, 200, res);
})

// update User profile 
const updateProfile = catchAsyncErrors(async(req,res,next)=>{
   const newUserData = {
    name: req.body.name,
    email: req.body.email,
   };

   //we will add cloudinary later 

   const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
   });

   res.status(200).json({
    success: true,
   });
   
})

// Get all users(admin)
const getAllUser = catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    })
})

// Get single users(admin)
const getSingleUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(
            new ErrorHandler(`User does not exist with id: ${req.params.id}`)
        );
    }
    res.status(200).json({
        success:true,
        user,
    });
});

// update User Role admin 
const updateUserRole = catchAsyncErrors(async(req,res,next)=>{
    const newUserData = {
     name: req.body.name,
     email: req.body.email,
     role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
     new: true,
     runValidators: true,
     useFindAndModify: true,
    });
 
    res.status(200).json({
     success: true,
     message: "User Deleted success...... "
    });
    
 })

 // delete user admin
const deleteUser = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.params.id);

    //we will remove cloudanry later

    if(!user){
        return next(
            new ErrorHandler(`user does not exist with id: ${req.params.id}`)
        );
    }

    await user.remove();
 
    res.status(200).json({
     success: true,
    });
    
 });

module.exports = {
    registerUser,
    loginUser, 
    logout, 
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUser,
    getSingleUser,
    updateUserRole,
    deleteUser
};