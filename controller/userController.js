const asyncHandler = require("express-async-handler"); // to handle error exceptions and async functions
const UserModel = require("../model/UserModel");
exports.getHomePage = asyncHandler(async (req, res, next) => {
  res.render("homePage", { title: "Ach-club" });
});
exports.getSignup = (req, res, next) => {
  res.send("sign Up form get ");
};

exports.postSignup = asyncHandler(async (req, res, next) => {
  res.send("sign Up form post ");
});

exports.getSignupEmailVerification = asyncHandler(async (req, res, next) => {
  res.send("signup email verification get ");
});

exports.postSignupEmailVerification = asyncHandler(async (req, res, next) => {
  res.send("signup email verification post ");
});

exports.getSignupPassword = asyncHandler(async (req, res, next) => {
  res.send("signup password get ");
});

exports.postSignupPassword = asyncHandler(async (req, res, next) => {
  res.send("signup password post ");
});

exports.getWelcomeSignIn = (req, res, next) => {
  res.send("welcome after signup ");
};

exports.getSignIn = (req, res, next) => {
  res.send("sign In get ");
};

exports.postSignIn = asyncHandler(async (req, res, next) => {
  res.send("sign In  post ");
});

exports.getUserPage = asyncHandler(async (req, res, next) => {
  res.send("signed user page ");
});

exports.getUserProfilePage = asyncHandler(async (req, res, next) => {
  res.send("user profile");
});

exports.getPictureUpdate = asyncHandler(async (req, res, next) => {
  res.send("picture update get");
});

exports.postPictureUpdate = asyncHandler(async (req, res, next) => {
  res.send("picture update post ");
});

exports.getMembershipConfirmation = (req, res, next) => {
  res.send("membership confirmation");
};
exports.postMembershipConfirmation = asyncHandler(async (req, res, next) => {
  res.send("membership confirmation post ");
});

exports.getAdminCredentials = (req, res, next) => {
  res.send("admin credentials get ");
};
exports.postAdminCredentials = asyncHandler(async (req, res, next) => {
  res.send("admin credentials post ");
});
