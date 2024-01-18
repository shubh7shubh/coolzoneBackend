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
  
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();
 
const path = require("path");

//-------------------------CSV UPLOAD -------------------------------

// Multer section


 

 
// end  multer section 



router.route("/products").get(getAllProducts);
router.route("/productcategoryList").get(getCategoriesNames);

router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);


router
  .route("/admin/bulkproducts/new")
  .post(isAuthenticatedUser , authorizeRoles("admin"), addProductsInBulk);


router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/product/wishlist/:id").put(isAuthenticatedUser,addToWishlist) 

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReview);

  router.route("/getuserreviews").get(isAuthenticatedUser,getUserReviews)

module.exports = router;
