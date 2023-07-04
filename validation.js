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

exports.createEmailValidationChain = (fieldName, errorText) => {
  return body(`${fieldName}`, `${errorText}`)
    .trim()
    .notEmpty()
    .withMessage("empty email not allowed")
    .isEmail()
    .withMessage("invalid email")
    .escape();
};
