const mongoose = require("mongoose");
const QuestionSchema = new mongoose.Schema(
    {
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        level: {
            type: String,
            required: true,
        },
        question: {
            type: String,
            required: true,
        },
        A: {
            type: String,
            required: true,
        },
        B: {
            type: String,
            required: true,
        },
        C: {
            type: String,
            required: true,
        },
        D: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        }

    },
    { timestamps: true }
);

const Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;
