const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { addBrand, getBrands, deleteBrand } = require("../controllers/brandController");


router
    .route("/admin/brand/new")
    .post(isAuthenticatedUser, authorizeRoles("admin"), addBrand);

router
    .route("/admin/getAllBrands")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getBrands)

router
    .route("/admin/brand/:brandId")
    // .put(isAuthenticatedUser, authorizeRoles("admin"), updateBanneer)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteBrand);


module.exports = router;
