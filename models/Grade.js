const mongoose = require("mongoose");
const GradeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        grade: {
            type: String,
            required: true,
        },
        testLevel: {
            type: String,
            required: true,
        },
        
    },
    { timestamps: true }
);
const Grade = mongoose.model("Grade", GradeSchema);
module.exports = Grade;
