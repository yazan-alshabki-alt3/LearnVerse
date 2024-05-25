const { Router } = require("express");
const router = Router();
const { protect, protectAdmin, protectTeacher } = require("../middlewares/authMiddleware.js");
const teacherController = require("../controllers/teacher.js");
const { validationHandler } = require("../helpers/validation.js");
const { add_update_question_validator } = require("../middlewares/validator.js");

//  ======================  Add Question To The Bank  ====================
router.post("/add-question-to-the-bank", validationHandler(add_update_question_validator)
    , protectTeacher, teacherController.addQuestionToTheBank);

//  ======================  Update Question In The Bank  ====================
router.patch("/update-question-in-the-bank", validationHandler(add_update_question_validator), protectTeacher, teacherController.updateQuestionInTheBank);

//  ======================  Remove Question From The Bank  ====================
router.delete("/remove-question-from-the-bank/:id", protectTeacher, teacherController.removeQuestionFromTheBank);

module.exports = router;
