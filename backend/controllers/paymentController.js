const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Coupon = require("../models/couponModel");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});


exports.newCoupon = catchAsyncErrors(async (req, res, next) => {

  const { coupon, amount } = req.body

  if (!coupon || !amount) {
    return res.status(400).json({
      success: false,
      message: "Invalid coupon data data",
    });
  }

  await Coupon.create({ code: coupon, amount })

  return res.status(201).json({
    success: true,
    message: `Coupon ${coupon} Created Successfully`
  })

})


exports.applyDiscount = catchAsyncErrors(async (req, res, next) => {
  const { coupon } = req.query;

  const discount = await Coupon.findOne({ code: coupon });

  if (!discount) {
    return res.status(400).json({
      success: false,
      message: "No discount found",
    });
  }

  return res.status(200).json({
    success: true,
    discount: discount.amount,
  });
});


exports.allCoupons = catchAsyncErrors(async (req, res, next) => {
  const coupons = await Coupon.find({});
  return res.status(200).json({
    success: true,
    coupons,
  });
});

exports.deleteCoupon = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findByIdAndDelete(id);

  if (!coupon) {
    return res.status(400).json({
      success: false,
      message: "Invalid coupon id",
    });
  }
  return res.status(200).json({
    success: true,
    message: `Coupon ${coupon.code} Deleted Successfully`,
  });
});
