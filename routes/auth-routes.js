const router = require("express").Router();
const passport = require("passport");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// auth google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // Add 'email' to the scope
  })
);

// callback route for google to redirect to
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  const currentUser = req.user;
  try {
    const token = jwt.sign(
      { userId: currentUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h", // Token expires in 24 hour
      }
    );
    return res.status(201).json({
      success: true,
      message: "User successfully logged in from Google",
      data: {
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
});

module.exports = router;
