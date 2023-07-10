const asyncHandler = require("express-async-handler"); // to handle error exceptions and async functions
const UserModel = require("../model/UserModel");
const UserInfoModel = require("../model/UserInfoModel");
const MessageModel = require("../model/MessageModel");
const validation = require("../validation");
const random = require("../helpers/generateFiveDigitNumber");
const sendConfirmationEmail = require("../helpers/sendConfirmationEmail");
const { validationResult, matchedData, body } = require("express-validator");
const passport = require("passport");

exports.getHomePage = asyncHandler(async (req, res, next) => {
  res.render("homePage", { title: "Ach-club" });
});
// signup
exports.getSignup = (req, res, next) => {
  res.render("signup");
};

//custom validator function
const uniqueEmailValidation =
  validation.createUniqueEmailValidator(UserInfoModel);
//
exports.postSignup = [
  validation.createStringValidationChain("firstname", "invalid name"),
  validation.createStringValidationChain("lastname", "invalid name"),
  body("email").custom(uniqueEmailValidation),
  validation.createEmailValidationChain("email", "invalid email format"),

  asyncHandler(async (req, res, next) => {
    const validationErr = validationResult(req);
    const validData = matchedData(req);
    //prepare data for save
    const confirmationCode = random.generateFiveDigitNumber();

    const userInfo = new UserInfoModel({
      firstname: validData.firstname,
      lastname: validData.lastname,
      email: validData.email,
      confirmationCode: confirmationCode,
    });
    // check validation
    if (!validationErr.isEmpty()) {
      res.render("signup", {
        errors: validationErr.array(),
        validData: validData,
      });
      return;
    }
    //if no error, save to db
    await userInfo.save();
    //send confirmation code to email
    await sendConfirmationEmail(validData.email, confirmationCode);

    res.redirect(userInfo.url + "/verification");
  }),
];

exports.getSignupEmailVerification = asyncHandler(async (req, res, next) => {
  res.render("emailVerification");
});

exports.postSignupEmailVerification = [
  validation.createCodeValidationChain("code", "invalid code"),
  asyncHandler(async (req, res, next) => {
    const inputCode = matchedData(req).code;
    //load user info
    const userInfoId = req.params.id;
    const userInfo = await UserInfoModel.findById(userInfoId);
    if (!userInfo) {
      res.render("signup");
      return;
    }
    //update input code in user info
    const updatedUserInfo = new UserInfoModel({
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
      email: userInfo.email,
      confirmationCode: userInfo.confirmationCode,
      inputCode: inputCode,
      trials: userInfo.trials + 1,
      _id: userInfo._id,
    });
    await UserInfoModel.findByIdAndUpdate(userInfoId, updatedUserInfo);
    if (!updatedUserInfo.hasConfirmedEmail) {
      if (updatedUserInfo.trials < 4) {
        res.render("emailVerification", { error: "invalid code. try again" });
        return;
      } else {
        await UserInfoModel.findByIdAndRemove(userInfoId);
        res.redirect("/user/signup");
        return;
      }
    }

    res.redirect("/user/" + userInfoId + "/pass");
  }),
];

exports.getSignupPassword = asyncHandler(async (req, res, next) => {
  res.render("password");
});

//pseudo and password validators
const createPseudoStringValidationChain =
  validation.createPseudoStringValidationChain(body);
const createUniquePseudoValidation =
  validation.createUniquePseudoValidator(UserModel);
const createUniqueUserValidation = validation.createUniqueUserValidator(
  UserModel,
  "id"
);
const createPasswordValidationChain =
  validation.createPasswordValidationChain(body);
const createPasswordConfirmation =
  validation.createPasswordConfirmationValidator("password");
//
exports.postSignupPassword = [
  createPseudoStringValidationChain("pseudo", "invalid Pseudo"),
  body("pseudo")
    .custom(createUniquePseudoValidation)
    .custom(createUniqueUserValidation),
  createPasswordValidationChain("password", "invalid password"),
  body("passConfirmation")
    .notEmpty()
    .withMessage("password confirmation is required")
    .custom(createPasswordConfirmation),
  asyncHandler(async (req, res, next) => {
    const userInfoId = req.params.id;
    const validationError = validationResult(req);
    const validData = matchedData(req);
    if (!validationError.isEmpty()) {
      res.render("password", { errors: validationError.array() });
      return;
    }
    // if data is valide then create userModel instance and save it
    const user = new UserModel({
      userInfo: userInfoId,
      pseudo: validData.pseudo,
      password: validData.password,
    });

    try {
      await user.save();
    } catch (error) {
      throw new Error(error);
    }

    res.redirect("/user/welcome");
  }),
];

exports.getWelcomeSignIn = (req, res, next) => {
  res.render("welcome");
};

exports.getSignIn = (req, res, next) => {
  res.render("signin");
};

exports.postSignIn = [
  passport.authenticate("local", {
    successRedirect: "/user/page",
    failureRedirect: "/user/signin",
    failureFlash: true,
  }),
];

exports.getUserPage = asyncHandler(async (req, res, next) => {
  const messages = await MessageModel.find({}).populate("user").exec();
  console.log("----------dsd-------" + messages[0].formatted_DateTime);
  res.render("userPage", { user: req.user, messages: messages });
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
  res.render("membership");
};
exports.postMembershipConfirmation = asyncHandler(async (req, res, next) => {
  const userDesireToBeMember = req.body.choice === "yes" ? true : false;
  if (userDesireToBeMember) {
    try {
      const userId = req.user._id; // get id from user saved with deserialzedUser function
      const user = await UserModel.findById(userId).exec();
      user.isMember = true;
      user._id = userId;
      await UserModel.findByIdAndUpdate(userId, user);
      return res.redirect("/user/page");
    } catch (e) {
      return next(e);
    }
  }
  return res.redirect("/user/page");
});

exports.getAdminCredentials = (req, res, next) => {
  res.send("admin credentials get ");
};
exports.postAdminCredentials = asyncHandler(async (req, res, next) => {
  res.send("admin credentials post ");
});

exports.postUserMessage = [
  validation.createMessageValidationChain("message", "invalid message"),
  asyncHandler(async (req, res, next) => {
    const validData = matchedData(req);
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.render("userPage", { errors: validationErrors.array() });
    }
    //prepare data for save if valide data
    const message = new MessageModel({
      user: req.user._id,
      message: validData.message,
    });
    try {
      await message.save();
      return res.redirect("/user/page");
    } catch (e) {
      return next(e);
    }
  }),
];

exports.postLogout = (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/user/signin");
  });
};
