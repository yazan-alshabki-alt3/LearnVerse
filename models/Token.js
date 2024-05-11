const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const TokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
TokenSchema.pre("save", async function (next) {
  const salt = await bcryptjs.genSalt();
  this.token = await bcryptjs.hash(this.token, salt);
});
const Token = mongoose.model("Token", TokenSchema);
module.exports = Token;
