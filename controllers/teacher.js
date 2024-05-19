const Question = require("../models/Question.js");

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
        console.log(err.message);
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




const teacherController = {
    addQuestionToTheBank,
    removeQuestionFromTheBank,
    updateQuestionInTheBank

};
module.exports = teacherController;
