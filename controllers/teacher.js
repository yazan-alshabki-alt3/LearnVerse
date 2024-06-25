const Question = require("../models/Question.js");
const { Category, Vocabulary } = require('../models/Category.js');
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
//  ======================  Add Question To The Bank  ====================

const addQuestionToTheBank = async (req, res) => {
    const teacherId = req.user._id;
    const level = req.body.level;
    const question = req.body.question;
    const A = req.body.A;
    const B = req.body.B;
    const C = req.body.C;
    const D = req.body.D;
    const answer = req.body.answer;


    try {
        const newQuestion = await Question.create({
            teacherId: teacherId,
            level: level,
            question: question,
            A: A,
            B: B,
            C: C,
            D: D,
            answer: answer,
        });
        return res.status(201).json({
            success: true,
            message: "Question add successfully !",
            data: newQuestion,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }

}

//  ======================  Update Question In The Bank  ====================

const updateQuestionInTheBank = async (req, res) => {

    const questionId = req.body.questionId;
    const level = req.body.level;
    const question = req.body.question;
    const A = req.body.A;
    const B = req.body.B;
    const C = req.body.C;
    const D = req.body.D;
    const answer = req.body.answer;
    const userId = req.user._id;

    try {
        const newQuestion = await Question.findOne({ _id: questionId });

        if (!newQuestion) {
            return res.status(404).json({
                success: false,
                message: "The question is not found !",
            });
        }

        if (newQuestion.teacherId.toString() !== userId.toString()) {
            return res.status(400).json({
                success: false,
                message: "The question is not yours' !",
            });
        }

        newQuestion.level = level;
        newQuestion.A = A;
        newQuestion.B = B;
        newQuestion.C = C;
        newQuestion.D = D;
        newQuestion.answer = answer;
        newQuestion.question = question;
        await newQuestion.save();

        return res.status(201).json({
            success: true,
            message: "Question Updated Successfully",
            data: newQuestion,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }

}

//  ======================  Remove Question From The Bank  ====================

const removeQuestionFromTheBank = async (req, res) => {
    const questionId = req.params.id;
    const userId = req.user._id;

    try {
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: `Question not found !`,
            });
        }
        if (question.teacherId.toString() !== userId.toString()) {
            return res.status(400).json({
                success: false,
                message: "The question is not yours' !",
            });
        }
        let deleteQuestionFromTheBank = await Question.findByIdAndDelete(questionId);
        return res.status(201).json({
            success: true,
            message: `The question has deleted successfully !`,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }
}

//  ======================  Add Vocabulary  ====================

const addVocabulary = async (req, res) => {
    const teacherId = req.user._id;
    const text = req.body.text;
    const categoryId = req.body.categoryId;

    let url = null;
    if (req.files.length > 0) {
        const result = await cloudinary.uploader.upload(req.files[0].path, {
            resource_type: "image",
        });
        url = result.secure_url;
    } else {
        return res.status(400).json({
            success: false,
            message: "The file for photo is Empty !",
        });
    }
    try {
        let category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not Found !",
            });
        }
        let voc = await Vocabulary.find({ text: text });

        if (voc.length !== 0) {
            return res.status(400).json({
                success: false,
                message: "Vocabulary is already exist !",
            });
        }
        let newVocabulary = await new Vocabulary({
            categoryId: categoryId,
            teacherId: teacherId,
            photo: url,
            text: text
        })
        await newVocabulary.save();
        category.vocabulary.push(newVocabulary);
        await category.save();
        return res.status(201).json({
            success: true,
            message: "Vocabulary add successfully !",
            data: newVocabulary,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }

}

//  ======================  Update Vocabulary  ====================

const updateVocabulary = async (req, res) => {

    const vocabularyId = req.body.vocabularyId;
    const text = req.body.text;
    const userId = req.user._id;

    let url = null;
    if (req.files.length > 0) {
        const result = await cloudinary.uploader.upload(req.files[0].path, {
            resource_type: "image",
        });
        url = result.secure_url;
    }
    try {
        const newVocabulary = await Vocabulary.findById(vocabularyId);

        if (!newVocabulary) {
            return res.status(404).json({
                success: false,
                message: "The vocabulary is not found !",
            });
        }

        if (newVocabulary.teacherId.toString() !== userId.toString()) {
            return res.status(400).json({
                success: false,
                message: "The vocabulary is not yours' !",
            });
        }
        let voc = await Vocabulary.find({ text: text });
        if (voc.length !== 0) {
            return res.status(400).json({
                success: false,
                message: "Vocabulary is already exist !",
            });
        }
        newVocabulary.text = text;
        if (url) { newVocabulary.photo = url; }
        newVocabulary.save();
        return res.status(201).json({
            success: true,
            message: "Vocabulary Updated Successfully",
            data: newVocabulary,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }

}

//  ======================  Remove Vocabulary  ====================

const removeVocabulary = async (req, res) => {
    const vocabularyId = req.params.id;
    const userId = req.user._id;

    try {
        const vocabulary = await Vocabulary.findById(vocabularyId);
        if (!vocabulary) {
            return res.status(404).json({
                success: false,
                message: `Vocabulary not found !`,
            });
        }
        if (vocabulary.teacherId.toString() !== userId.toString()) {
            return res.status(400).json({
                success: false,
                message: "The vocabulary is not yours' !",
            });
        }
        let category = await Category.findById(vocabulary.categoryId);
        category.vocabulary = category.vocabulary.filter(function (value, index, arr) {
            return value.toString() !== vocabularyId.toString();
        });
        await category.save();
        let deleteVocabularyFromTheBank = await Vocabulary.findByIdAndDelete(vocabularyId);
        return res.status(201).json({
            success: true,
            message: `The vocabulary has deleted successfully !`,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }
}


//  ======================  Add Category  ====================

const addCategory = async (req, res) => {
    const teacherId = req.user._id;
    const name = req.body.name;

    try {
        
        let cat = await Category.find({ name: name });
        if (cat.length !== 0) {
            return res.status(400).json({
                success: false,
                message: "Category is already exist !",
            });
        }

        const category = await Category.create({
            teacherId: teacherId,
            name: name
        });
        return res.status(201).json({
            success: true,
            message: "Category added successfully !",
            data: category,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }

}
//  ======================  Remove Category  ====================

const deleteCategory = async (req, res) => {
    const categoryId = req.params.id;
    const userId = req.user._id;

    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: `Category not found !`,
            });
        }
        if (category.teacherId.toString() !== userId.toString()) {
            return res.status(400).json({
                success: false,
                message: "The category is not yours' !",
            });
        }
        let deleteCategory = await Category.findByIdAndDelete(categoryId);
        return res.status(201).json({
            success: true,
            message: `The category has deleted successfully !`,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }
}

const teacherController = {
    addQuestionToTheBank,
    removeQuestionFromTheBank,
    updateQuestionInTheBank,
    removeVocabulary,
    updateVocabulary,
    addVocabulary,
    addCategory,
    deleteCategory,


};
module.exports = teacherController;
