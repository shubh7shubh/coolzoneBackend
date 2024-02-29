const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const reduceStock = require("../utils/features")


exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    user,
    subtotal,
    // tax,
    shippingCharges,
    discount,
    total,
    referral
  } = req.body;

  if (!shippingInfo || !orderItems || !user || !subtotal || !total) {
    // if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total) {
    res.status(400).json({
      success: false,
      message: "Invalid order data, missing fields",
    });
    return;
  }

  // Check and update referral counts if referral is provided
  if (referral) {
    const userRef = await User.findOne({ _id: referral });
    const currentUser = await User.findOne({ _id: user });

    if (userRef && currentUser && userRef._id.toString() !== currentUser._id.toString()) {
      const count = userRef?.referralCount + 50;
      userRef.referralCount = count;
      await userRef?.save();
      const count2 = currentUser?.referralCount + 25;
      currentUser.referralCount = count2;
      await currentUser?.save();
    }
  }

  const order = await Order.create({
    shippingInfo,
    orderItems,
    user,
    subtotal,
    shippingCharges,
    discount,
    total,
  });

  await reduceStock(orderItems);

  res.status(201).json({
    success: "true",
    message: "Order Placed Successfully"
  })
})

exports.myOrders = catchAsyncErrors(async (req, res, next) => {

  const { id: user } = req.query

  if (!user) {
    res.status(400).json({
      success: false,
      message: "User not found"
    })
  }

  const orders = await Order.find({ user })


  return res.status(200).json({
    success: true,
    orders
  })

})

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // here only name of user should be visible
  const order = await Order.findById(id).populate("user", "name")

  if (!order) {
    res.status(400).json({
      success: false,
      message: "No Order found"
    })
  }

  return res.status(200).json({
    success: true,
    order
  })

})

exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  // Check if the user is authenticated and has the necessary role
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  // Fetch all orders
  const orders = await Order.find().populate("user", "name");

  return res.status(200).json({
    success: true,
    orders,
  });
});

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {

  const { id } = req.params

  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  await order.deleteOne()

  res.status(200).json({
    success: "true",
    message: "Order Deleted Successfully"
  })
})

exports.processOrder = catchAsyncErrors(async (req, res, next) => {

  const { id } = req.params

  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  switch (order.status) {
    case "Processing":
      order.status = "Shipped";
      break;
    case "Shipped":
      order.status = "Delivered";
      break;

    default:
      order.status = "Delivered"
      break;
  }

  await order.save()

  res.status(200).json({
    success: "true",
    message: "Order Processed Successfully"
  })
})
