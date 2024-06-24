const User = require("../models/User.js");
const { Category, Vocabulary } = require('../models/Category.js');
const { validationResult } = require("express-validator");
const existingEmail = async (email) => {
  const check_email = await User.findOne({ email });
  if (check_email) {
    throw new Error("Email already exist.");
  }
  return true;
};
const existingCategory = async (category) => {
  const check_category = await Category.findOne({ name: category });
  if (check_category) {
    throw new Error("Category already exist.");
  }
  return true;
};

const validatePhoto = (value, { req }) => {
  if (req.files.length <= 0) {
    return true;
  }
  const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/svg+xml",
  ];
  if (!allowedImageTypes.includes(req.files[0].mimetype)) {
    throw new Error("Invalid file type. Only JPEG and PNG are allowed.");
  }
  return true;
};

const validateVideo = (value, { req }) => {
  if (req.files.length <= 0) {
    return true;
  }

  const allowedVideoTypes = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/avi",
    "video/mov",
    "video/mkv"
  ];

  if (!allowedVideoTypes.includes(req.files[0].mimetype)) {
    throw new Error("Invalid file type. Only MP4, WebM, OGG, AVI, MOV, and MKV video formats are allowed.");
  }

  return true;
};

const titleCase = async (name) => {
  return name
    ?.toLowerCase()
    ?.split(" ")
    .map(function (text) {
      return text?.charAt(0).toUpperCase() + text?.slice(1);
    })
    .join(" ");
};

const validationHandler = (values = []) => {
  return async (req, res, next) => {
    await Promise.all(values.map((value) => value.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const _errors = errors.array();
    let message = "Invalid Parameters:";

    _errors.forEach((v) => {
      message += `${v.param},`;
    });
    return res.status(422).json({ success: false, errors: errors.array() });
  };
};

const isWebSiteRequest = (userAgent) => {
  console.log(userAgent);
  if (/firefox/i.test(userAgent)) {
    return true;
  } else if (/chrome/i.test(userAgent)) {
    return true;
  } else if (/safari/i.test(userAgent)) {
    return true;
  } else if (/msie|trident/i.test(userAgent)) {
    return true;
  } else if (/edge/i.test(userAgent)) {
    return true;
  } else if (/PostmanRuntime/i.test(userAgent)) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  isWebSiteRequest,
  validationHandler,
  titleCase,
  validatePhoto,
  existingEmail,
  validateVideo,
  existingCategory
};
