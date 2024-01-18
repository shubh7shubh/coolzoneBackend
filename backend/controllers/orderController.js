const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require('../models/userModel');
const nodemailer = require('nodemailer'); // For sending email notifications
const sendEmail = require('../utils/sendEmail'); // Update the path accordingly


// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
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
// =======================================================


// Create new Order by admin 
exports.createAdminOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    // shippingPrice,
    totalPrice,
    cId
  } = req.body;

  // console.log("hello i am cid "+cId)

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    // shippingPrice,
    totalPrice,
    cId,
    paidAt: Date.now(),
    user: req.user._id,
  });

  
  res.status(201).json({
    success: true,
    order,
  });
});


// ====================================================

// Update Order by admin
exports.updateAdminOrder = catchAsyncErrors(async (req, res, next) => {
  const orderId = req.params.id; 

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    cId,
    orderStatus,
    orderNote
  } = req.body;

  // Find the order by ID
  let order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Update the order fields
  order.shippingInfo = shippingInfo;
  order.orderItems = orderItems;
  order.paymentInfo = paymentInfo;
  order.itemsPrice = itemsPrice;
  order.taxPrice = taxPrice;
  order.shippingPrice = shippingPrice;
  order.totalPrice = totalPrice;
  order.cId = cId;
  order.orderStatus = orderStatus;
  order.orderNote = orderNote;

  // Save the updated order
  order = await order.save();
  
  console.log(order)
  res.status(200).json({
    success: true,
    order
  });
});



// ====================================================
// get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
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

// update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHander("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
    message:"your order is canceled now "
  });
});


// ========================================================

exports.buyNow = catchAsyncErrors(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id; 

  // Create a new order
  const order = await Order.create({
    user: userId,
    product: productId,
  });

  // Send email notification to the admin using the sendEmail utility function
  const adminEmailOptions = {
    email: 'mayankjaiswal20180@gmail.com', // Replace with your admin email address
    subject: 'New Order Notification',
    message: `New order has been placed with Order ID: ${order._id}`,
  };

  await sendEmail(adminEmailOptions);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    order,
  });
});