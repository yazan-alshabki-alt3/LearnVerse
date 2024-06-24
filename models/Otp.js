const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const OtpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Otp = mongoose.model("Otp", OtpSchema);
module.exports = Otp;
