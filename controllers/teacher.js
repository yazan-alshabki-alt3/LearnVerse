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

const teacherController = {
    addQuestionToTheBank
};
module.exports = teacherController;
