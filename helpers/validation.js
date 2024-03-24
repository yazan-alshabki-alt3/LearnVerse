import User from "../models/User.js";
import { validationResult } from "express-validator";
export const existingEmail = async (email) => {
  const check_email = await User.findOne({ email });
  if (check_email) {
    throw new Error("Email already exist.");
  }
  return true;
};
export const validatePhoto = (value, { req }) => {
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
export const titleCase = async (name) => {
  return name
    ?.toLowerCase()
    ?.split(" ")
    .map(function (text) {
      return text?.charAt(0).toUpperCase() + text?.slice(1);
    })
    .join(" ");
};

export const validationHandler = (values = []) => {
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

export const isWebSiteRequest = (userAgent) => {
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
