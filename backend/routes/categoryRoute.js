const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { multerMiddleware } = require("../middleware/multer");
const { addCategory, getCategories, deleteCategory } = require("../controllers/categoryController");


// router.route("/banners").get(getAllBanners);

router
    .route("/admin/category/new")
    .post(isAuthenticatedUser, authorizeRoles("admin"), addCategory);

router
    .route("/admin/getAllCategories")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getCategories)

router
    .route("/admin/category/:categoryId")
    // .put(isAuthenticatedUser, authorizeRoles("admin"), updateBanneer)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCategory);


module.exports = router;
