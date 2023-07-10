const { body, matchedData, validationResult } = require("express-validator");

//some custom validation functions
exports.createPasswordConfirmationValidator =
  (passwordInputName) =>
  (confirmationValue, { req }) => {
    if (confirmationValue !== req.body[`${passwordInputName}`]) {
      throw new Error("Password confirmation does not match.");
    }
    return true;
  };
exports.createUniquePseudoValidator = (dataModel) => async (fieldValue) => {
  try {
    const data = await dataModel.findOne({ pseudo: fieldValue });
    if (data) {
      throw new Error(
        "That Pseudo is already used. Please try another pseudo."
      );
    } else if (!data) {
      return true;
    }
  } catch (error) {
    if (error.code) {
      throw new Error("Something went wrong. Please try again later.");
    } else {
      throw new Error("Error: " + error.message);
    }
  }
};
exports.createUniqueUserValidator =
  (dataModel, idRoutingParameter) =>
  async (fieldValue, { req }) => {
    try {
      const data = await dataModel.findOne({
        userInfo: req.params[`${idRoutingParameter}`],
      });
      if (data) {
        throw new Error(
          "user already exist.Please go to Home page and Sign In"
        );
      } else if (!data) {
        return true;
      }
    } catch (error) {
      if (error.code) {
        throw new Error("Something went wrong. Please try again later.");
      } else {
        throw new Error("Error: " + error.message);
      }
    }
  };

exports.createUniqueEmailValidator = (dataModel) => async (fieldValue) => {
  try {
    const data = await dataModel.findOne({ email: fieldValue });
    if (data) {
      throw new Error("Email already exists. Please choose a different email.");
    } else if (!data) {
      return true;
    }
  } catch (error) {
    if (error.code) {
      throw new Error("Something went wrong. Please try again later.");
    } else {
      throw new Error("Error: " + error.message);
    }
  }
};
// some validation chains
exports.createPseudoStringValidationChain =
  (reqDataObject) => (fieldname, errorText) => {
    return reqDataObject(`${fieldname}`, `${errorText}`)
      .trim()
      .notEmpty()
      .withMessage(`empty ${fieldname} not allowed.`)
      .isLength({ min: 4 })
      .withMessage(`${fieldname} must have at least 4 characters.`)
      .isLength({ max: 15 })
      .withMessage(`${fieldname} must have at most 15 characters.`)
      .custom((inputedPseudo) => isNaN(inputedPseudo))
      .withMessage("number pseudo not allowed. Please try another pseudo. ")
      .escape();
  };
exports.createPasswordValidationChain =
  (reqDataObject) => (fieldname, errorText) => {
    return reqDataObject(`${fieldname}`, `${errorText}`)
      .notEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long.")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter.")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one digit.")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage(
        "Password must contain at least one special character like: ! @ # $ % ^ & * ( ), . ?) "
      );
  };

exports.createStringValidationChain = (fieldname, errorText) => {
  return body(`${fieldname}`, `${errorText}`)
    .trim()
    .notEmpty()
    .withMessage(`empty ${fieldname} not allowed`)
    .isLength({ min: 2, max: 30 })
    .withMessage(`${fieldname} must have at least 2 characters`)
    .escape();
};

exports.createEmailValidationChain = (fieldName, errorText) => {
  return body(`${fieldName}`, `${errorText}`)
    .trim()
    .notEmpty()
    .withMessage("empty email not allowed")
    .isEmail()
    .withMessage("invalid email")
    .escape();
};

exports.createCodeValidationChain = (fieldName, errorText) => {
  return body(`${fieldName}`, `${errorText}`)
    .trim()
    .notEmpty()
    .withMessage("empty code not allowed")
    .isNumeric()
    .withMessage("invalid code")
    .escape();
};

exports.createMessageValidationChain = (fieldName, errorText) => {
  return body(`${fieldName}`, `${errorText}`)
    .trim()
    .notEmpty()
    .withMessage("empty message not allowed")
    .escape();
};
