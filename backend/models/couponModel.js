// const mongoose = require("mongoose");

// const CouponSchema = mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Please Enter Coupon name"],
//     uppercase:true
//   },
//   code:{
//     type: String,
//     // required: [true, "Please Enter Coupon code"],
//   },
//   coupontype:{
//     type: String,
//     // required: [true, "Please Enter Coupon coupontype"],
//   },
//   CouponSegment:{
//     type: String,
//     // required: [true, "Please Enter Coupon CouponSegment"],
//   },
//   maxUsePerCustomer:{
//     type: String,
//     // required: [true, "Please Enter Coupon maxUsePerCustomer"],
//   },
//   discription:{
//     type: String,
//     // required: [true, "Please Enter Coupon discription"],
//   },
//   discount: {
//     type: Number,
//     required: [true, "Please Enter Coupon discount"],
//   },
//   percentage: {
//     type: Boolean ,
//     required: [true, "Please Enter Coupon percentage"],
//   },
//   expiry: {
//     type: Date,
//     required: [true, "Please Enter Coupon expiry"],
//     trim: true,
//   },
//   isFirstTimeLogin: {
//     type: Boolean,
//     default: true, // Set to true by default
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Coupon", CouponSchema);


// import mongoose from "mongoose";
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Please enter the Coupon Code"],
    unique: true,
  },
  amount: {
    type: Number,
    required: [true, "Please enter the Discount Amount"],
  },
});

module.exports = mongoose.model("Coupon", schema);
// module.exports = mongoose.model("Coupon", CouponSchema);
