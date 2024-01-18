const mongoose = require("mongoose");

const CouponSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Coupon name"],
    uppercase:true
  },
  code:{
    type: String,
    // required: [true, "Please Enter Coupon code"],
  },
  coupontype:{
    type: String,
    // required: [true, "Please Enter Coupon coupontype"],
  },
  CouponSegment:{
    type: String,
    // required: [true, "Please Enter Coupon CouponSegment"],
  },
  maxUsePerCustomer:{
    type: String,
    // required: [true, "Please Enter Coupon maxUsePerCustomer"],
  },
  discription:{
    type: String,
    // required: [true, "Please Enter Coupon discription"],
  },
  discount: {
    type: Number,
    required: [true, "Please Enter Coupon discount"],
  },
  percentage: {
    type: Boolean ,
    required: [true, "Please Enter Coupon percentage"],
  },
  expiry: {
    type: Date,
    required: [true, "Please Enter Coupon expiry"],
    trim: true,
  },
  isFirstTimeLogin: {
    type: Boolean,
    default: true, // Set to true by default
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Coupon", CouponSchema);
