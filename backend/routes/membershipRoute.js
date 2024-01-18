const express = require("express");
const router = express.Router();

const {
  createMembership,
  getAlLMembershipOffers,
  updateMembershipOffers,
  deleteMembershipOffers,
  addMembership,
  addProductToMemberShip,
  getMembershipList,
  createProductMembership,
  updateMembershipItem,
  getMemberDetails
} = require("../controllers/membershipControllere");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/mebershipoffers").get(getAlLMembershipOffers);


router
  .route("/admin/membership/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createMembership);

router
  .route("/admin/ProductMembership")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProductMembership);

router
  .route("/admin/updateitem")
  .patch(isAuthenticatedUser, authorizeRoles("admin"), updateMembershipItem);

  
router
.route('/usermembershipdetails/:id')
.get(isAuthenticatedUser, getMemberDetails);

router
  .route("/admin/membershipslist")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getMembershipList);

router
  .route("/admin/membership/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateMembershipOffers)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteMembershipOffers);

router.route("/membership/addmembership/:id").put(isAuthenticatedUser, addMembership);
router.route("/membership/addProductToMemberShip").put(isAuthenticatedUser, addProductToMemberShip);

module.exports = router;
