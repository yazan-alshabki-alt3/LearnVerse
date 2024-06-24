const mongoose = require("mongoose");
const SubscribeSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Course",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        }
    },
    { timestamps: true }
);
const Subscribe = mongoose.model("Subscribe", SubscribeSchema);
module.exports = Subscribe;
