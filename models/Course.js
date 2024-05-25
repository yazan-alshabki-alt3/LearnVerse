const mongoose = require("mongoose");
const CourseSchema = new mongoose.Schema(
    {
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        name: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        likes: {
            type: Number,
            default: 0
        }

    },
    { timestamps: true }
);
const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
