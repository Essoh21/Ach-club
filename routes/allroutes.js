const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.get("/", userController.getHomePage);
router.get("/signup", userController.getSignup);
router.post("/signup", userController.postSignup);
router.get("/email", userController.getSignupEmailVerification);
router.post("/email", userController.postSignupEmailVerification);
router.get("/pass", userController.getSignupPassword);
router.post("/pass", userController.postSignupPassword);
router.get("/welcome", userController.getWelcomeSignIn);
router.get("/signin", userController.getSignIn);
router.post("/signin", userController.postSignIn);
router.get("/user/:id", userController.getUserPage);
router.get("/user/:id/profile", userController.getUserProfilePage);
router.get("user/:id/picture-update", userController.getPictureUpdate);
router.post("/user/:id/picture-update", userController.postPictureUpdate);
router.get("user/:id/member-request", userController.getMembershipConfirmation);
router.post(
  "user/:id/member-request",
  userController.postMembershipConfirmation
);
router.get("user/:id/admin", userController.getAdminCredentials);
router.get("user/:id/admin", userController.postAdminCredentials);

module.exports = router;
