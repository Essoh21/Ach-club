const asyncHandler = require("express-async-handler"); // to handle error exceptions and async functions
const UserModel = require("../model/UserModel");
const UserInfoModel = require("../model/UserInfoModel");
const MessageModel = require("../model/MessageModel");
const validation = require("../validation");
const random = require("../helpers/generateFiveDigitNumber");
const sendConfirmationEmail = require("../helpers/sendConfirmationEmail");
const { validationResult, matchedData, body } = require("express-validator");
const passport = require("passport");
const avatarsLinks = require("../helpers/avatarsLinks");
const bcrypt = require("bcryptjs");
const AdminModel = require("../model/AdminModel");

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
  res.render("userPage", { user: req.user, messages: messages });
});

exports.getUserProfilePage = asyncHandler(async (req, res, next) => {
  res.render("profile", { user: req.user });
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
      const updatedUser = {
        userInfo: user.userInfo,
        pseudo: user.pseudo,
        password: user.password,
        isMember: true,
        isAdmin: user.isAdmin,
        isAuthenticatedAdmin: user.isAuthenticatedAdmin,
        adminTrials: user.adminTrials,
        _id: user._id,
        avatar: user.avatar,
      };

      await UserModel.findByIdAndUpdate(userId, updatedUser);
      return res.redirect("/user/page");
    } catch (e) {
      return next(e);
    }
  }
  return res.redirect("/user/page");
});

exports.getAdminCredentials = (req, res, next) => {
  res.render("adminCredentials");
};
exports.postAdminCredentials = asyncHandler(async (req, res, next) => {
  const inputedName = req.body.adminName;
  const inputedPassword = req.body.adminPass;
  const user = req.user;
  let error = "";
  //get admin doc, all users and all messages
  const adminDoc = await AdminModel.findOne({ name: inputedName }).exec();
  if (user.adminTrials > 3) {
    const updatedUser = {
      userInfo: user.userInfo,
      pseudo: user.pseudo,
      password: user.password,
      isMember: user.isMember,
      isAdmin: false,
      isAuthenticatedAdmin: false,
      adminTrials: user.adminTrials + 1,
      _id: user._id,
      avatar: user.avatar,
    };
    await UserModel.findByIdAndUpdate(user._id, updatedUser);
    res.redirect("/user/page");
  }
  if (!adminDoc) {
    error = "invalid admin name or password";
    //update his trials
    const updatedUser = {
      userInfo: user.userInfo,
      pseudo: user.pseudo,
      password: user.password,
      isMember: user.isMember,
      isAdmin: user.isAdmin,
      isAuthenticatedAdmin: false,
      adminTrials: user.adminTrials + 1,
      _id: user._id,
      avatar: user.avatar,
    };
    await UserModel.findByIdAndUpdate(user._id, updatedUser);
    return res.render("adminCredentials", { error: error });
  }
  const adminPasswordIsCorrect = await bcrypt.compare(
    inputedPassword,
    adminDoc.adminPass
  );
  if (!adminPasswordIsCorrect) {
    error = "invalid admin name or password";
    const updatedUser = {
      userInfo: user.userInfo,
      pseudo: user.pseudo,
      password: user.password,
      isMember: user.isMember,
      isAdmin: user.isAdmin,
      isAuthenticatedAdmin: false,
      adminTrials: user.adminTrials + 1,
      _id: user._id,
      avatar: user.avatar,
    };
    await UserModel.findByIdAndUpdate(user._id, updatedUser);
    return res.render("adminCredentials", { error: error });
  }

  // if admin data are correct
  const updatedUser = {
    userInfo: user.userInfo,
    pseudo: user.pseudo,
    password: user.password,
    isMember: user.isMember,
    isAdmin: user.isAdmin,
    isAuthenticatedAdmin: true,
    adminTrials: 0,
    _id: user._id,
    avatar: user.avatar,
  };
  await UserModel.findByIdAndUpdate(user._id, updatedUser);
  return res.redirect("/admin/page");
});

exports.getAdminPage = asyncHandler(async (req, res, next) => {
  const [allUsers, allMessages] = await Promise.all([
    UserModel.find({}).exec(),
    MessageModel.find({}).populate("user").exec(),
  ]);
  return res.render("adminPage", {
    users: allUsers,
    messages: allMessages,
    user: req.user,
  });
});

exports.postAdminQuit = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const updatedUser = {
    userInfo: user.userInfo,
    pseudo: user.pseudo,
    password: user.password,
    isMember: user.isMember,
    isAdmin: user.isAdmin,
    isAuthenticatedAdmin: false,
    adminTrials: user.adminTrials,
    _id: user._id,
    avatar: user.avatar,
  };
  await UserModel.findByIdAndUpdate(user._id, updatedUser);
  res.redirect("/user/page");
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

exports.getChangeAvatar = (req, res, next) => {
  res.render("avatarChange", { avatars: avatarsLinks, user: req.user });
};
exports.postLogout = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const updatedUser = {
    userInfo: user.userInfo,
    pseudo: user.pseudo,
    password: user.password,
    isMember: user.isMember,
    isAdmin: user.isAdmin,
    isAuthenticatedAdmin: false,
    adminTrials: user.adminTrials,
    _id: user._id,
    avatar: user.avatar,
  };
  if (user.isAuthenticatedAdmin) {
    await UserModel.findByIdAndUpdate(user._id, updatedUser);
  }
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/user/signin");
  });
});

exports.getRequestedUser = asyncHandler(async (req, res, next) => {
  const requestedUserId = req.params.id;
  const [requestedUser, allMessages] = await Promise.all([
    UserModel.findById(requestedUserId).exec(),
    MessageModel.find().populate("user").exec(),
  ]);
  const requestedUserMessages = allMessages.filter((message) => {
    return message.user._id + "" === requestedUserId + "";
  });
  return res.render("userRequested", {
    user: requestedUser,
    messages: requestedUserMessages,
  });
});
exports.getDeleteMessage = asyncHandler(async (req, res, next) => {
  const messageId = req.params.messageid;
  const message = await MessageModel.findById(messageId).exec();
  res.render("messageDelete", { message: message });
});
exports.postDeleteMessage = asyncHandler(async (req, res, next) => {
  const messageId = req.params.messageid;
  const adminChoice = req.body.choice;
  if (adminChoice !== "yes") {
    return redirect("/admin/page");
  }
  await MessageModel.findByIdAndRemove(messageId);
  res.redirect("/admin/page");
});
exports.getDeleteUserMessages = asyncHandler(async (req, res, next) => {
  const userId = req.params.userid;
  const user = await UserModel.findById(userId).exec();
  res.render("messagesDelete", { userPseudo: user.pseudo });
});
exports.postDeleteUserMessages = asyncHandler(async (req, res, next) => {
  const userId = req.params.userid;
  const adminChoice = req.body.choice;
  if (adminChoice !== "yes") {
    return res.redirect("/admin/page");
  }
  const allMessages = await MessageModel.find().populate("user").exec();
  const userMessages = allMessages.filter((message) => {
    return message.user._id + "" === userId + "";
  });
  const queries = userMessages.map((userMessage) => {
    return MessageModel.findByIdAndRemove(userMessage._id).exec();
  });
  await Promise.all(queries);
  return res.redirect("/admin/page");
});

exports.getDeleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.userid;
  const [user, allMessages] = await Promise.all([
    UserModel.findById(userId).exec(),
    MessageModel.find({}).exec(),
  ]);
  const userMessages = allMessages.filter((message) => {
    return message.user._id + "" === userId + "";
  });
  res.render("userDelete", {
    userPseudo: user.pseudo,
    userMessages: userMessages,
  });
});

exports.postDeleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.userid;
  const adminChoice = req.body.choice;
  if (adminChoice !== "yes") {
    return res.redirect("/admin/page");
  }
  const user = await UserModel.findById(userId).populate("userInfo").exec();
  const userInfoId = user.userInfo._id;
  await Promise.all([
    UserModel.findByIdAndRemove(userId),
    UserInfoModel.findByIdAndRemove(userInfoId),
  ]);
  return res.redirect("/admin/page");
});

exports.postChangeAvatar = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const userId = user._id;
  const chosenAvatarname = req.body.chosenAvatar;
  const chosenAvatarLink = avatarsLinks.find((avatarOject) => {
    return avatarOject.name === chosenAvatarname;
  }).url;
  const updatedUser = {
    userInfo: user.userInfo,
    pseudo: user.pseudo,
    password: user.password,
    isMember: user.isMember,
    isAdmin: user.isAdmin,
    isAuthenticatedAdmin: user.isAuthenticatedAdmin,
    adminTrials: user.adminTrials,
    _id: user._id,
    avatar: chosenAvatarLink,
  };
  await UserModel.findByIdAndUpdate(userId, updatedUser);
  return res.redirect("/user/page");
});
