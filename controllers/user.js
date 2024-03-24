const User = require("../models/User.js");
const Token = require("../models/Token.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authenticationWithGoogle = require("../utils/sendEmail.js");
const { isWebSiteRequest } = require("../helpers/validation.js");
const cloudinary = require("cloudinary").v2;
const { titleCase } = require("../helpers/validation.js");
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// ================== Register User ==================
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Hash user password..
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // create user in database
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    const user_data = {
      firstName,
      lastName,
      email,
      _id: user._id,
      userType: user.userType,
      photo: user.photo,
      activated: user.activated,
    };
    const hashCode = await crypto.randomBytes(32).toString("hex");
    const token = await Token.create({
      userId: user._id,
      token: hashCode,
      createdAt: Date.now(),
    });
    await authenticationWithGoogle(
      user.email,
      user.firstName,
      hashCode,
      user._id
    );
    return res.status(201).json({
      success: true,
      message:
        "Account successfully created you can activate it from you gmail account !",
      data: user_data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again later.",
    });
  }
};

// ================== Login User ==================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found, return an error
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.activated) {
      return res.status(400).json({
        success: false,
        message: "Check your email to active your account !",
      });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match, return an error
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h", // Token expires in 24 hour
    });

    //Send HTTP-only
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      // after (24 * 60 * 60 = 86400) = 1 day the token is expired
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: true,
    });

    // Send the token in the response
    return res.status(201).json({
      success: true,
      message: "User successfully logged in",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again later.",
    });
  }
};

// ================== Login Status ==================
const loginStatus = async (req, res) => {
  const userAgent = req.headers["user-agent"] || "";
  if (isWebSiteRequest(userAgent)) {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User has not logged in",
      });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
      return res.status(200).json({
        success: true,
        message: "User has logged in",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "User token is invalid",
      });
    }
  } else {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User has not logged in",
      });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
      return res.status(200).json({
        success: true,
        message: "User has logged in",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "User token is invalid",
      });
    }
  }
};

// ================== Get User ==================
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found, please signup",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User successfully found",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Your Id is not valid, please signup",
    });
  }
};

// ================== Update User ==================
const updateUser = async (req, res) => {
  let newUser = "";
  if (req.files.length > 0) {
    const result = await cloudinary.uploader.upload(req.files[0].path, {
      resource_type: "image",
    });
    fs.unlinkSync(req.files[0].path);
    const url = result.secure_url;
    newUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      photo: url,
    };
  } else {
    newUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: newUser },
      { new: true }
    );

    const userData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      photo: user.photo,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return res.status(201).json({
      success: true,
      message: "Profile Updated Successfully",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again later.",
    });
  }
};
// ================== Get User By Id ==================
const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found, please signup",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User successfully found",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User Id is not valid, please try again !",
    });
  }
};

// ================== Get Users By Name ==================
const getUsersByName = async (req, res) => {
  let userName = req.body.userName;
  userName = await titleCase(userName);
  userName = userName.trim();
  try {
    const users = await User.find({ firstName: userName });
    return res.status(200).json({
      success: true,
      message: `The users with name { ${userName} } `,
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again later.",
    });
  }
};

// ================== Activate User ==================
const activateUser = async (req, res) => {
  let userId = req.params.id;
  let token = req.params.token;
  try {
    let findToken = await Token.findOne({ userId: userId });
    if (findToken) {
      const isValid = await bcrypt.compare(token, findToken.token);
      if (isValid) {
        const updateUser = await User.updateOne(
          { _id: userId },
          { $set: { activated: true } },
          { new: true }
        );
        res.redirect(`${process.env.URL_HOST}/user/login`);
      } else {
        return res.status(400).json({
          success: false,
          message: `Invalid token !`,
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: `Token not found !`,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again later.",
    });
  }
};

// ================== Delete User Account ==================
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found !`,
      });
    }
    let deleteUserAccount = await User.findByIdAndDelete(userId);
    return res.status(200).json({
      success: true,
      message: `The account has deleted successfully !`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again later.",
    });
  }
};
// ================== Get All Users ==================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      message: `All users in our website  `,
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again later.",
    });
  }
};

const userController = {
  registerUser,
  loginUser,
  loginStatus,
  getUser,
  updateUser,
  getUserById,
  getUsersByName,
  activateUser,
  deleteUser,
  getAllUsers,
};
module.exports = userController;
