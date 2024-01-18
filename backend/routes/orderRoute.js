const express = require("express");
const {
  newOrder,
  createAdminOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
  updateAdminOrder,
  buyNow
} = require("../controllers/orderController");

const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { protected } = require("../middleware/protected");

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router.route("/admin/orders").post(isAuthenticatedUser, authorizeRoles("admin"), createAdminOrder);


router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router 
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router
  .route("/admin/updateorderdetails/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateAdminOrder)

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);



router.route('/buy-now').post(isAuthenticatedUser, buyNow);


module.exports = router;
