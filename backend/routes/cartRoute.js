const express = require("express");
const router = express.Router();

const {userCart,getUserCart,emptytCart,applyCoupon}= require("../controllers/cartController");
const {isAuthenticatedUser, authorizeRoles} =require("../middleware/auth")

router.route("/addtomycart").post(isAuthenticatedUser,userCart)
router.route("/mycart").get(isAuthenticatedUser,getUserCart)
router.route("/emptycart").delete(isAuthenticatedUser,emptytCart)
router.route("/applycoupon").post(isAuthenticatedUser,applyCoupon)

module.exports=router;