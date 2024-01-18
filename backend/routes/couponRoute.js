const express = require("express");
const {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  userLogin,
  // applyCoupon,
} = require("../controllers/couponController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/admin/coupons")
  .get(isAuthenticatedUser, authorizeRoles("admin","user"), getAllCoupons);

router
  .route("/admin/coupon/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createCoupon);

router
  .route("/admin/updatecoupon/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateCoupon);

router
  .route("/admin/coupon/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCoupon);

router.route("/coupon/welcomecoupon").post(isAuthenticatedUser, userLogin);

module.exports = router;
