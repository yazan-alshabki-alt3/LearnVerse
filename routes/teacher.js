const { Router } = require("express");
const router = Router();
const { protect, protectAdmin, protectTeacher } = require("../middlewares/authMiddleware.js");
const teacherController = require("../controllers/teacher.js");
const { validationHandler } = require("../helpers/validation.js");
const { add_update_question_validator, add_vocabulary_validator, update_vocabulary_validator, add_category_validator } = require("../middlewares/validator.js");
const upload = require("../utils/fileUpload.js");

//  ======================  Add Question To The Bank  ====================
router.post("/add-question-to-the-bank", validationHandler(add_update_question_validator)
    , protectTeacher, teacherController.addQuestionToTheBank);

//  ======================  Update Question In The Bank  ====================
router.patch("/update-question-in-the-bank", validationHandler(add_update_question_validator)
    , protectTeacher, teacherController.updateQuestionInTheBank);

//  ======================  Remove Question From The Bank  ====================
router.delete("/remove-question-from-the-bank/:id", protectTeacher, teacherController.removeQuestionFromTheBank);


//#########################################################################################################################################################
//#########################################################################################################################################################
//#########################################################################################################################################################

//  ======================  Add Category  ====================
router.post("/add-category", validationHandler(add_category_validator)
    , protectTeacher, teacherController.addCategory);

//  ======================  delete Category  ====================
router.delete("/delete-category/:id", protectTeacher, teacherController.deleteCategory);




//  ======================  Add Vocabulary  ====================
router.post("/add-vocabulary", upload.array("photo", 1), validationHandler(add_vocabulary_validator)
    , protectTeacher,
    teacherController.addVocabulary);

//  ======================  Update Vocabulary  ====================
router.patch("/update-vocabulary", upload.array("photo", 1), validationHandler(update_vocabulary_validator)
    , protectTeacher,
    teacherController.updateVocabulary);

//  ======================  Remove Vocabulary  ====================
router.delete("/remove-vocabulary/:id", protectTeacher, teacherController.removeVocabulary);

module.exports = router;
