const Order = require("../models/orderModels");
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apifeatures');
const { ErrorHandler } = require("../utils/errorhandler");

//Create a New order

const newOrder = catchAsyncErrors(async(req,res,next)=>{
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
    });  
});


// get single order 
const getSingleOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate(
        "user", 
        "name email"
    );

    if(!order){
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    res.status(200).json({
        success: true,
        order,
    }); 
});

// get logged user orders
const myOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.find({user: req.user._id});

    res.status(200).json({
        success: true,
        order,
    }); 
});

// get all orders --admin

const getAllorders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });
    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    }); 
});


// Update order status -- Admin
const updateOrder = catchAsyncErrors(async(req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("Order not found with this Id", 400));
    }

    order.orderItems.forEach(async(order)=>{
        await updateStock(order.product,order.quantity)
    });

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliverdAt = Date.now();
    }

    await order.save({validateBeforeSave:false});
    res.status(200).json({
        success: true,
    });

});

async function updateStock(id, quantity){
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({validateBeforeSave: false});
}

// Delete Order --Admin

const deleteOrder = catchAsyncErrors(async(req,res,next) =>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found with this Id", 404));
    }
    
    await order.remove();

    res.status(200).json({
        success: true,
    });

})

module.exports = { newOrder, getSingleOrder, myOrder,getAllorders,deleteOrder, updateOrder}