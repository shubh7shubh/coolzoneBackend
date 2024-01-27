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

  const { coupon, amount, description } = req.body

  if (!coupon || !amount || !description) {
    return res.status(400).json({
      success: false,
      message: "Invalid coupon data data",
    });
  }

  await Coupon.create({ code: coupon, amount, description })

  return res.status(201).json({
    success: true,
    message: `Coupon ${coupon} Created Successfully`
  })

})


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

  const discount = await Coupon.findOne({ code: coupon });

  if (!discount) {
    return res.status(400).json({
      success: false,
      message: "No discount found",
    });
  }

  let discountedAmount;

  switch (discount.amount) {
    case 2000:
      if (total >= 10000) {
        discountedAmount = discount.amount;
      }
      break;

    case 1000:
      if (total >= 5000) {
        discountedAmount = discount.amount;
      }
      break;

    case 100:
      if (total >= 1000) {
        discountedAmount = discount.amount;
      }
      break;

    default:
      // Handle other cases if needed
      return res.status(400).json({
        success: false,
        message: "Invalid discount amount",
      });
  }

  if (discountedAmount) {
    return res.status(200).json({
      success: true,
      discount: discountedAmount,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Discount not applicable for the given total",
    });
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
