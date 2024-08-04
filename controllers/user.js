const User = require("../models/User.js");
const Token = require("../models/Token.js");
const Otp = require("../models/Otp.js");
const Order = require("../models/Order.js");
const Question = require("../models/Question.js");
const Grade = require("../models/Grade.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Category, Vocabulary } = require('../models/Category.js');
const crypto = require("crypto");
const authenticationWithGoogle = require("../utils/sendEmail.js");
const resetThePasswordWithGoogle = require("../utils/resetPasswordEmail.js");
const { isWebSiteRequest } = require("../helpers/validation.js");
const cloudinary = require("cloudinary").v2;
const { titleCase } = require("../helpers/validation.js");
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
const { ObjectId } = require('mongoose').Types;
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
        field: 'email',
        message: "User not found !",
      });
    }

    if (!user.activated) {
      return res.status(400).json({
        success: false,
        field: 'email',
        message: "Check your email to active your account !",
      });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match, return an error
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        field: 'password',
        message: "Incorrect password !",
      });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h", // Token expires in 24 hour
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
  try {
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
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "User token is invalid ",
    });
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
      level: user.level,
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
        // delete this token
        await Token.deleteOne({ _id: findToken._id });
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
}

// ================== Forgot Password ==================

const forgotPassword = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const otp = Math.floor(18726 + Math.random() * 80000);
    const newToken = await Otp.create({
      userId: user._id,
      otp: otp,
      createdAt: Date.now(),
    });
    await resetThePasswordWithGoogle(
      user.email,
      user.firstName,
      otp,
      user._id
    );
    return res.status(201).json({
      success: true,
      message:
        "Message successfully sent you can reset your password from your Gmail account !",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again later.",
    });
  }
};
// ================== Reset Password ==================

const resetPassword = async (req, res) => {
  let userId = req.params.id;
  let token = req.body.token;
  let newPassword = req.body.password;
  try {
    let findToken = await Otp.findOne({ userId: userId });
    if (findToken) {
      const isValid = (findToken.otp.toString() === token.toString());
      if (isValid) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);
        const updateUser = await User.updateOne(
          { _id: userId },
          { $set: { password: hashPassword } },
          { new: true }
        );
        await Otp.deleteOne({ _id: findToken._id });

        return res.status(201).json({
          success: true,
          message: "Password successfully updated !",
        });
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

// ================== Order Promotion To Professor ==================

const orderPromotionToProfessor = async (req, res) => {
  let userId = req.user._id;
  let url;
  console.log(req.files[0].path);
  if (req.files.length > 0) {
    const result = await cloudinary.uploader.upload(req.files[0].path, {
      resource_type: "image",
    });
    url = result.secure_url;
  }

  try {
    const order = await Order.create({
      userId: userId,
      image: url,
    });
    return res.status(201).json({
      success: true,
      message: "Order sent successfully !",
      data: order,
    });


  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again later.",
    });
  }
};

const onlineTest = async (req, res) => {
  const level = req.body.level;
  const userId = req.user._id;
  try {

    const randomQuestions = await Question.aggregate([
      { $match: { level: level } }, // Filter questions by the specific level
      { $sample: { size: 10 } } // Get a random sample of 10 questions
    ]);
    return res.status(201).json({
      success: true,
      message: "Test sent successfully !",
      data: randomQuestions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again later.",
    });
  }

}


// ============= Save Grade  =============

const saveGrade = async (req, res) => {
  const userId = req.user._id;
  const testLevel = req.body.testLevel;
  const grade = req.body.grade;
  try {
    let gradeForUser = await Grade.findOne({ userId: userId, testLevel: testLevel });

    if (!gradeForUser) {
      const newGrade = await Grade.create({
        userId: userId,
        grade: grade,
        testLevel: testLevel,
      });
      return res.status(201).json({
        success: true,
        message: "Grade sent successfully !",
        data: newGrade,
      });
    } else {
      gradeForUser.grade = grade;
      gradeForUser.save();

      return res.status(201).json({
        success: true,
        message: "Grade updated successfully !",
        data: gradeForUser,
      });
    }


  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again later.",
    });
  }


}


// ============= Evaluation Test  =============

const evaluationTest = async (req, res) => {
  const userId = req.user._id;
  try {
    const test = [];
    for (let level = 'A'.charCodeAt(0); level <= 'C'.charCodeAt(0); level++) {
      const character = String.fromCharCode(level); // Output: A, B, C

      const randomQuestions1 = await Question.aggregate([
        { $match: { level: character + '1' } }, // Filter questions by the specific level
        { $sample: { size: 2 } } // Get a random sample of 10 questions
      ]);
      test.push(...randomQuestions1);
      const randomQuestions2 = await Question.aggregate([
        { $match: { level: character + '2' } }, // Filter questions by the specific level
        { $sample: { size: 2 } } // Get a random sample of 10 questions
      ]);
      test.push(...randomQuestions2);
    }
    return res.status(201).json({
      success: true,
      message: "Evaluation test sent successfully !",
      data: test,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again later.",
    });
  }

}

// ============= Save Evaluation =============

const saveEvaluation = async (req, res) => {
  const userId = req.user._id;
  const level = req.body.level;
  try {

    const user = await User.findById(userId);
    if ((user.level[0] < level[0]) || (user.level[0] == level[0] && user.level[1] < level[1])) {
      const newUser = {
        level: level
      };
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: newUser },
        { new: true }
      );
      return res.status(201).json({
        success: true,
        message: "User evaluated successfully !",
        data: user,
      });
    } else {
      return res.status(201).json({
        success: true,
        message: "Old level is better than new one !",
        data: user,
      });
    }

  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again later.",
    });
  }


}




//  ======================  Get All Category  ====================

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({
      success: true,
      message: `All categories in our website  `,
      data: categories,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again later.",
    });
  }
}



//  ======================  Get Vocabulary In Specific Category  ====================

const getVocabularyInSpecificCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category not found !`,
      });
    }
    const vocabularies = await Vocabulary.find({ categoryId: categoryId });
    return res.status(200).json({
      success: true,
      message: `All vocabularies in this category  `,
      data: vocabularies,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again later.",
    });
  }
}


//  ======================  Random Test Vocabulary In Specific Category  ====================

const randomTestVocabularyInSpecificCategory = async (req, res) => {
  let categoryId = req.body.categoryId;
  categoryId = new ObjectId(categoryId);
  try {
    const randomVocabulary = await Vocabulary.aggregate([
      { $match: { categoryId: categoryId } },
      { $sample: { size: 10 } },
    ]);

    let test = [];
    for (let i = 0; i < randomVocabulary.length; i++) {
      const excludedItem = randomVocabulary[i]._id;
      const randomVocabularyOptions = await Vocabulary.aggregate([
        { $match: { categoryId: categoryId, _id: { $ne: excludedItem } } },
        { $sample: { size: 3 } },
      ]);
      let options = [];
      options.push({ text: randomVocabulary[i].text, isAnswer: true });
      for (let j = 0; j < randomVocabularyOptions.length; j++) {
        options.push({ text: randomVocabularyOptions[j].text, isAnswer: false });
      }
      options.sort(() => Math.random() - 0.5);
      test.push({
        photo: randomVocabulary[i].photo,
        options: options
      });

    }

    return res.status(200).json({
      success: true,
      message: `Test vocabularies in this category `,
      data: test,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again later.",
    });
  }
}


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
  forgotPassword,
  resetPassword,
  orderPromotionToProfessor,
  onlineTest,
  saveGrade,
  evaluationTest,
  saveEvaluation,
  getAllCategories,
  getVocabularyInSpecificCategory,
  randomTestVocabularyInSpecificCategory
};
module.exports = userController;
