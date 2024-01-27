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
const { multerMiddleware } = require("../middleware/multer");


router.route("/banners").get(getAllBanners);

router
  .route("/admin/banner/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), multerMiddleware.array("bannerImages"), createBanner);

router
  .route("/admin/getAllBanners")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllBanners)

router
  .route("/admin/banner/:bannerId")
  // .put(isAuthenticatedUser, authorizeRoles("admin"), updateBanneer)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteBanner);


module.exports = router;
