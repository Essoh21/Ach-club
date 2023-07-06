const asyncHandler = require("express-async-handler"); // to handle error exceptions and async functions
const UserModel = require("../model/UserModel");
const UserInfoModel = require("../model/UserInfoModel");
const validation = require("../validation");
const random = require("../helpers/generateFiveDigitNumber");
const sendConfirmationEmail = require("../helpers/sendConfirmationEmail");
const { validationResult, matchedData, body } = require("express-validator");

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
const createPasswordValidationChain =
  validation.createPasswordValidationChain(body);
const createPasswordConfirmation =
  validation.createPasswordConfirmationValidator("password");
//
exports.postSignupPassword = [
  createPseudoStringValidationChain("pseudo", "invalid Pseudo"),
  body("pseudo").custom(createUniquePseudoValidation),
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
    await user.save();
    res.send(user);
  }),
];

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
