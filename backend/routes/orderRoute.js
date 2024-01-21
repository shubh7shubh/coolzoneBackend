const express = require("express");
// const {
//   newOrder,
//   createAdminOrder,
//   getSingleOrder,
//   myOrders,
//   getAllOrders,
//   updateOrder,
//   deleteOrder,
//   updateAdminOrder,
//   buyNow
// } = require("../controllers/orderController");

const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { protected } = require("../middleware/protected");
const { newOrder, getSingleOrder, allOrders, myOrders, deleteOrder, processOrder } = require("../controllers/orderController");


router.route("/order/new").post(newOrder);

// // route - /api/v1/order/my
// router.get("/all", adminOnly, allOrders);
router.route("/orders/all")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allOrders);


// // route - /api/v1/order/my
router.get("/orders/my", myOrders);



router
  .route("/order/:id")
  .get(getSingleOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder)
  .put(isAuthenticatedUser, authorizeRoles("admin"), processOrder);


module.exports = router;
