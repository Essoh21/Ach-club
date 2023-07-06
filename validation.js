const { body, matchedData, validationResult } = require("express-validator");

exports.createStringValidationChain = (fieldname, errorText) => {
  return body(`${fieldname}`, `${errorText}`)
    .trim()
    .notEmpty()
    .withMessage(`empty ${fieldname} not allowed`)
    .isLength({ min: 2, max: 30 })
    .withMessage(`${fieldname} must have at least 2 characters`)
    .escape();
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
      throw new Error("Something went wrong. Please try again later");
    } else {
      throw new Error("Error: " + error.message);
    }
  }
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
    .withMessage("empty code node allowed")
    .isNumeric()
    .withMessage("invalid code")
    .escape();
};
