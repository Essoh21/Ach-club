const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const routesProtection = require("../helpers/routesProtection");

router.get("/", userController.getHomePage);
router.get(
  "/user/signup",
  routesProtection.redirectAuthenticatedUser,
  userController.getSignup
);
router.post("/user/signup", userController.postSignup);
router.get(
  "/user/:id/info/verification",
  routesProtection.redirectAuthenticatedUser,
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
  "/user/admin-pass",
  routesProtection.authorizeAuthenticatedUser,
  routesProtection.redirectAuthenticatedAdmin,
  routesProtection.authorizeMember,
  userController.getAdminCredentials
);
router.post(
  "/user/admin-pass",
  routesProtection.authorizeAuthenticatedUser,
  routesProtection.authorizeMember,
  routesProtection.authorizeAdmin,
  userController.postAdminCredentials
);
router.get(
  "/admin/page",
  routesProtection.authorizeAuthenticatedUser,
  routesProtection.authorizeAdmin,
  routesProtection.authorizeAuthenticatedAdmin,
  userController.getAdminPage
);

router.get(
  "/user/requested/:id",
  routesProtection.authorizeAuthenticatedUser,
  routesProtection.authorizeAuthenticatedAdmin,
  userController.getRequestedUser
);

router.get(
  "/requested/message/:messageid/delete",
  routesProtection.authorizeAdmin,
  routesProtection.authorizeAuthenticatedAdmin,
  userController.getDeleteMessage
);
router.post(
  "/requested/message/:messageid/delete",
  routesProtection.authorizeAdmin,
  routesProtection.authorizeAuthenticatedAdmin,
  userController.postDeleteMessage
);
router.get(
  "/requested/:userid/messages/delete",
  routesProtection.authorizeAdmin,
  routesProtection.authorizeAuthenticatedAdmin,
  userController.getDeleteUserMessages
);

router.post(
  "/requested/:userid/messages/delete",
  routesProtection.authorizeAdmin,
  routesProtection.authorizeAuthenticatedAdmin,
  userController.postDeleteUserMessages
);
router.get(
  "/requested/:userid/delete",
  routesProtection.authorizeAdmin,
  routesProtection.authorizeAuthenticatedAdmin,
  userController.getDeleteUser
);
router.post(
  "/requested/:userid/delete",
  routesProtection.authorizeAdmin,
  routesProtection.authorizeAuthenticatedAdmin,
  userController.postDeleteUser
);

router.post(
  "/admin/logout",
  routesProtection.authorizeAdmin,
  routesProtection.authorizeAuthenticatedAdmin,
  routesProtection.authorizeMember,
  userController.postAdminQuit
);

router.post(
  "/user/logout",
  routesProtection.authorizeAuthenticatedUser,
  userController.postLogout
);

router.post(
  "/user/message",
  routesProtection.authorizeMember,
  userController.postUserMessage
);

router.get(
  "/user/change-avatar",
  routesProtection.authorizeAuthenticatedUser,
  userController.getChangeAvatar
);
router.post("/user/change-avatar", userController.postChangeAvatar);
module.exports = router;
