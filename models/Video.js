const mongoose = require("mongoose");
const VideoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
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
        views: {
            type: Number,
            default: 0,
        }
    },
    { timestamps: true }
);
const Video = mongoose.model("Video", VideoSchema);
module.exports = Video;
