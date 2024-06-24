const mongoose = require("mongoose");
const LoveSchema = new mongoose.Schema(
    {
        videoId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Video",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        }
    },
    { timestamps: true }
);
const Love = mongoose.model("Love", LoveSchema);
module.exports = Love;
