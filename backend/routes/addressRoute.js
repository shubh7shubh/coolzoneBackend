const express = require("express");
const router = express.Router();

const {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
} = require("../controllers/addressController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


router.route("/me/getmyaddress").get(isAuthenticatedUser, getAddresses);

router
  .route("/me/address/new")
  .post(isAuthenticatedUser, authorizeRoles("user"), addAddress);

router
  .route("/me/address/:id")
  .put(isAuthenticatedUser, authorizeRoles("user"), updateAddress)
  .delete(isAuthenticatedUser, authorizeRoles("user"), deleteAddress);


module.exports = router;
