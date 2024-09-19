const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Coupon = require("../models/couponModel");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// exports.processPayment = catchAsyncErrors(async (req, res, next) => {
//   const { amount } = req.body;
//   console.log(process.env.STRIPE_SECRET_KEY);
//   if (!amount) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid amount",
//     });
//   }

//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: Number(amount) * 100,
//     currency: "inr",
//     description: "Payment for order #12345",
//   });

//   return res.status(201).json({
//     success: true,
//     clientSecret: paymentIntent.client_secret,
//   });
// });

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const { amount, shippingInfo } = req.body;

  if (!amount || !shippingInfo) {
    return res.status(400).json({
      success: false,
      message: "Invalid amount or missing shipping information",
    });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100, // Convert to smallest currency unit
    currency: "inr",
    description: "Payment for order #12345",
    shipping: {
      name: shippingInfo.name, // Make sure to pass customer's name
      address: {
        line1: shippingInfo.address, // Customer's street address
        city: shippingInfo.city, // Customer's city
        state: shippingInfo.state, // Customer's state
        postal_code: shippingInfo.pinCode, // Customer's postal code
        country: shippingInfo.country, // Customer's country (e.g., "IN" for India)
      },
    },
  });

  return res.status(201).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});

exports.newCoupon = catchAsyncErrors(async (req, res, next) => {
  const { coupon, amount, description, limit } = req.body;

  if (!coupon || !amount || !description || !limit) {
    return res.status(400).json({
      success: false,
      message: "Invalid coupon data data",
    });
  }

  await Coupon.create({ code: coupon, amount, description, limit });

  return res.status(201).json({
    success: true,
    message: `Coupon ${coupon} Created Successfully`,
  });
});

// exports.applyDiscount = catchAsyncErrors(async (req, res, next) => {
//   const { coupon, total } = req.query;

//   const discount = await Coupon.findOne({ code: coupon });

//   if (!discount) {
//     return res.status(400).json({
//       success: false,
//       message: "No discount found",
//     });
//   }

//   return res.status(200).json({
//     success: true,
//     discount: discount.amount,
//   });
// });

exports.applyDiscount = catchAsyncErrors(async (req, res, next) => {
  const { coupon, total } = req.query;

  try {
    const discount = await Coupon.findOne({ code: coupon });

    if (!discount) {
      return res.status(400).json({
        success: false,
        message: "No discount found",
      });
    }

    // Check if the total meets the limit criteria
    if (discount.limit && total < discount.limit) {
      return res.status(400).json({
        success: false,
        message: "Discount not applicable for the given total",
      });
    }

    // Apply the discount and send the response
    return res.status(200).json({
      success: true,
      discount: discount.amount,
    });
  } catch (error) {
    throw new Error(error);
  }
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
