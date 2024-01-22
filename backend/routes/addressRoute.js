const express = require("express");
const { addAddress, getAllAddresses, deleteAddress } = require("../controllers/addressController");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();

// const {
//     addAddress,
//     getAddresses,
//     updateAddress,
//     deleteAddress,
// } = require("../controllers/addressController");
// const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


// router.route("/me/getmyaddress").get(isAuthenticatedUser, getAddresses);

// router
//   .route("/me/address/new")
//   .post(isAuthenticatedUser, authorizeRoles("user"), addAddress);

// router
//   .route("/me/address/:id")
//   .put(isAuthenticatedUser, authorizeRoles("user"), updateAddress)
//   .delete(isAuthenticatedUser, authorizeRoles("user"), deleteAddress);

router.route("/me/addAddress").post(isAuthenticatedUser, addAddress);
router.route("/me/getMyAddress").get(isAuthenticatedUser, getAllAddresses);
router.route("/me/deleteAddress/:addressId").delete(isAuthenticatedUser, deleteAddress);



module.exports = router;
