const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const routesProtection = require("../helpers/routesProtection");

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
router.get(
  "/user/:id/pass",
  routesProtection.redirectAuthenticatedUser,
  userController.getSignupPassword
);
router.post("/user/:id/pass", userController.postSignupPassword);
router.get(
  "/user/welcome",
  routesProtection.redirectAuthenticatedUser,
  userController.getWelcomeSignIn
);
router.get(
  "/user/signin",
  routesProtection.redirectAuthenticatedUser,
  userController.getSignIn
);
router.post(
  "/user/signin",
  routesProtection.redirectAuthenticatedUser,
  userController.postSignIn
);
router.get(
  "/user/page",
  routesProtection.authorizeAuthenticatedUser,
  userController.getUserPage
);
router.get(
  "/user/profile",
  routesProtection.authorizeAuthenticatedUser,
  userController.getUserProfilePage
);
router.get(
  "user/picture-update",
  routesProtection.authorizeAuthenticatedUser,
  userController.getPictureUpdate
);
router.post("/user/picture-update", userController.postPictureUpdate);
router.get(
  "/user/member-request",
  routesProtection.authorizeAuthenticatedUser,
  userController.getMembershipConfirmation
);
router.post("/user/member-request", userController.postMembershipConfirmation);
router.get(
  "/user/admin",
  routesProtection.authorizeAuthenticatedUser,
  userController.getAdminCredentials
);
router.post("/user/admin", userController.postAdminCredentials);

module.exports = router;
