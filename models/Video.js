const mongoose = require("mongoose");
const VideoSchema = new mongoose.Schema(
    {
        title: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Course",
        },
        url: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);
const Video = mongoose.model("Video", VideoSchema);
module.exports = Video;
