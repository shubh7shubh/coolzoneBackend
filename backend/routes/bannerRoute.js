const express = require("express");
const router = express.Router();

const {
  getAllBanners,
  createBanner,
  updateBanneer,
  deleteBanner,
  // getBannerDetails,
} = require("../controllers/bannerController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


router.route("/banners").get(getAllBanners);

router
  .route("/admin/banner/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createBanner);

router
  .route("/admin/banner/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateBanneer)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteBanner);


module.exports = router;
