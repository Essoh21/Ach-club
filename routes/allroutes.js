const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.get("/", userController.getHomePage);
router.get("/user/signup", userController.getSignup);
router.post("/user/signup", userController.postSignup);
router.get(
  "/user/:id/info/verification",
  userController.getSignupEmailVerification
);
router.post(
  "/user/:id/info/verification",
  userController.postSignupEmailVerification
);
router.get("/user/:id/pass", userController.getSignupPassword);
router.post("/user/:id/pass", userController.postSignupPassword);
router.get("/user/welcome", userController.getWelcomeSignIn);
router.get("/user/signin", userController.getSignIn);
router.post("/user/signin", userController.postSignIn);
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
