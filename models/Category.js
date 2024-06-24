const mongoose = require("mongoose");
const VocabularySchema = new mongoose.Schema(
    {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Category",
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        photo: {
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
const CategorySchema = new mongoose.Schema(
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
        vocabulary: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vocabulary",
        }]
    },
    { timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema);
const Vocabulary = mongoose.model("Vocabulary", VocabularySchema);
module.exports = { Category, Vocabulary };
