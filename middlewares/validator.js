const { body } = require("express-validator");

const {
  existingEmail,
  titleCase,
  validatePhoto,
} = require("../helpers/validation.js");

const register_user_validator = [
  body("firstName")
    .exists()
    .withMessage("First Name is required")
    .notEmpty()
    .withMessage("First Name cannot be empty")
    .trim()
    .customSanitizer(titleCase),

  body("lastName")
    .exists()
    .withMessage("Last Name is required")
    .notEmpty()
    .withMessage("Last Name cannot be empty")
    .trim()
    .customSanitizer(titleCase),

  body("email")
    .normalizeEmail()
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid")
    .custom(existingEmail),

  body("password")
    .exists()
    .withMessage("Password is required")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

const login_user_validator = [
  body("email")
    .normalizeEmail()
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

const update_user_validator = [
  body("firstName")
    .exists()
    .withMessage("First Name is required")
    .notEmpty()
    .withMessage("First Name cannot be empty")
    .trim()
    .customSanitizer(titleCase),
  body("lastName")
    .exists()
    .withMessage("Last Name is required")
    .notEmpty()
    .withMessage("Last Name cannot be empty")
    .trim()
    .customSanitizer(titleCase),
  body("photo")
    .custom(validatePhoto)
    .withMessage("Photo is required with correct type"),
];
module.exports = {
  update_user_validator,
  login_user_validator,
  register_user_validator,
};
