const express = require("express");
const {
  getAllProducts,
  getCategoriesNames,
  createProduct,
  addProductsInBulk,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
  addToWishlist,
  getUserReviews,
  getLatestProducts,
  getAllCategories,
  getWishlist,
  deleteFromWishlist,
  deleteRandomsProducts,
  getAllHomeProducts,

} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { multerMiddleware } = require("../middleware/multer");
const router = express.Router();

// const path = require("path");
// import {upload} from "../middlewares/multer.middleware.js"
// import { upload } from "../middleware/multer.js";

// const { multerMiddleware } = require('../middleware/multer.js');


router.route("/products").get(getAllProducts);
// router.route("/productcategoryList").get(getCategoriesNames);
router.route("/latest-products").get(getLatestProducts)

router.route("/allProducts").get(getAllHomeProducts)

router.route("/categories").get(getAllCategories)

router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

// router.route("/admin/product/new").post(
//   isAuthenticatedUser,
//   authorizeRoles("admin"),
//   multerMiddleware.array("productImages", 5),
//   createProduct
// );


// CreateProduct
router.route("/admin/product/new").post(
  isAuthenticatedUser,
  authorizeRoles("admin"),
  multerMiddleware.array("productImages", 4),
  createProduct
);


router
  .route("/admin/bulkproducts/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), addProductsInBulk);


router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), multerMiddleware.array("productImages", 4), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// router.route("/product/wishlist/:id").put(isAuthenticatedUser, addToWishlist)

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReview);

router.route("/getuserreviews").get(isAuthenticatedUser, getUserReviews)

// delete products route

// router
//   .route("/admin/product")
//   .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteRandomsProducts);

// Wishlists Products

router.route("/addToWishlist").post(isAuthenticatedUser, addToWishlist)
router.route("/getWishlist").get(isAuthenticatedUser, getWishlist)
router.route("/wishlist/:wishlistId").delete(isAuthenticatedUser, deleteFromWishlist)




module.exports = router;



