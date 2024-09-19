const express = require("express");
const {
  processPayment,
  sendStripeApiKey,
  newCoupon,
  applyDiscount,
  allCoupons,
  deleteCoupon,
} = require("../controllers/paymentController");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/payment/process").post(processPayment);

router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);



// // route - /api/v1/payment/coupon/new
router.get("/discount", applyDiscount);


// route - /api/v1/payment/coupon/new
router
  .route("/coupon/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newCoupon);


// // route - /api/v1/payment/coupon/all
router
  .route("/coupon/all")
  .get(isAuthenticatedUser, allCoupons);

// // route - /api/v1/payment/coupon/:id
router
  .route("/coupon/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCoupon);




module.exports = router;
