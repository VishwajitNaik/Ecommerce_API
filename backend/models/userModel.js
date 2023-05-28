const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Plz Enter Your name"],
        maxLength:[30,"Name cannot exceed 30 charactors"],
        minLength:[4, "Name should have more than 4 charactors"]
    },
    email:{
        type: String,
        required:[true, "Plz Enter your Email"],
        unique: true,
        validate: [validator.isEmail, "plz enter a valid email"] 
    },
    password:{
        type:String,
        required:[true, "Plz Enter Your Password"],
        minLength:[8, "password should be greter than 8 charactors"],
        select: false,
    },
    avatar:{
        public_id:{
            type:String,
            required: true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type: String,
        default:"user",
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})

// JWT TOKEN
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    })
} 

// compaire password
userSchema.methods.compairedPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generating password reset token 
// userSchema.methods.getResetPasswordToken = function(){
//     // Generate token 
//     const resetToken = crypto.randomBytes(20).toString("hex");

//     // hsashing & adding resetPassword to userSchema

//     this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//     // reset Password expire 
//     this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

//     return resetToken;


// }

userSchema.methods.getResetPasswordToken = function(){
    
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.resetPasswordExpire = Date.now() + 15*60*1000;

    return resetToken;

}

module.exports = mongoose.model("User", userSchema);
