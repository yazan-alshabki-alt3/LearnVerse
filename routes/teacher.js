const { Router } = require("express");
const router = Router();
const { protect, protectAdmin, protectTeacher } = require("../middlewares/authMiddleware.js");
const teacherController = require("../controllers/teacher.js");

//  ======================  Add Question To The Bank  ====================
router.post("/add-question-to-the-bank", protectTeacher, teacherController.addQuestionToTheBank);

//  ======================  Update Question In The Bank  ====================
router.patch("/update-question-in-the-bank", protectTeacher, teacherController.updateQuestionInTheBank);

//  ======================  Remove Question From The Bank  ====================
router.delete("/remove-question-from-the-bank/:id", protectTeacher, teacherController.removeQuestionFromTheBank);

module.exports = router;
