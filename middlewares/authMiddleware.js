import User from "../models/User.js";
import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract the token from the authorization header
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized ,Please login.",
      });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifyToken) {
      return res.status(401).json({
        success: false,
        message: "Token has expired, Please login again.",
      });
    }
    const user = await User.findById(verifyToken.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again later.",
    });
  }
};

export default protect;
