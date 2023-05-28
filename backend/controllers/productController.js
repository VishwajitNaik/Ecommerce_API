const { param } = require('../app');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apifeatures');
const { ErrorHandler } = require('../utils/errorhandler');


    // Create Product --> Adamin
const createProduct = catchAsyncErrors(async (req,res,next)=>{
    
    req.body.user = req.user.id
    
    const product = await Product.create(req.body);
        res.status(201).json({
            success:true,
            product
        });
    });

// get all product

const getAllproducts = catchAsyncErrors(async (req,res,next)=>{
        const resultPerPage = 8;
        const productsCount = await Product.countDocuments();
        // Here you can see query = I assign Product.find() because seeach working all products so I assing all product to search or more features added here
        // req.query.keyword(req.query) this i indicate the keyword which are present as a name
        const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
        const products = await apiFeature.query;
        
        res.status(201).json({
            success:true,
            products,
            productsCount,
        });
    });

// get single product 
const getProductDetails = catchAsyncErrors(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product Not Found", 404));
    }

     await product.remove();
     res.status(200).json({
        success:true,
        product,
    })
});    

// update Product --> Adamin 
const updateProduct = catchAsyncErrors(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product Not Found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        product
    })
});

// delete a product --> Adamin

const deleteAproduct = catchAsyncErrors(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product Not Found", 404));
    }

     await product.remove();
     res.status(200).json({
        success:true,
        message: "product deleted success....."
    })
});


// create a new review update the review 

const createProductRiview = catchAsyncErrors(async(req,res, next)=>{
    const {rating, comment, productId} = req.body;
    
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());

    if(isReviewed){
        product.reviews.forEach((rev) => {
            if(rev.user.toString() === req.user._id.toString())
            (rev.rating = rating), (rev.comment = comment);
        });
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev)=>{
      avg += rev.rating;  
    })
    product.ratings = avg / product.reviews.length;
    await product.save({validateBeforeSave : false});
    res.status(200).json({
        success: true,
    })
});

// Get all Reviews of a Product

const getAllProductReviews = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product Not Found", 404)); 
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

// Delete a Review 

const deleteReviews = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product Not Found", 404)); 
    }

    const reviews = product.reviews.filter(
        (rev)=> rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    product.reviews.forEach((rev)=>{
      avg += rev.rating;  
    });

    const rating = avg / reviews.length;
    const numOfReviews = reviews.length;
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        rating,
        numOfReviews,
    },{
        new : true,
        runValidators: true,
        useFindAndModify: false
    }
    );
    
    res.status(200).json({
        success: true,
    });
});


module.exports  = {
    getAllproducts,
    createProduct,
    updateProduct,
    deleteAproduct,
    getProductDetails,
    createProductRiview,
    getAllProductReviews,
    deleteReviews
}