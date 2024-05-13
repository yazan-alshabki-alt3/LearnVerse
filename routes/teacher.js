const { Router } = require("express");
const router = Router();
const { protect, protectAdmin, protectTeacher } = require("../middlewares/authMiddleware.js");
const teacherController = require("../controllers/teacher.js");

//  ======================  Add Question To The Bank  ====================
router.post("/add-question-to-the-bank", protectTeacher, teacherController.addQuestionToTheBank);


module.exports = router;
