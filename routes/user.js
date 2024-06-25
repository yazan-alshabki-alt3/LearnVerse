const { Router } = require("express");
const router = Router();
const { protect, protectAdmin, protectTeacher } = require("../middlewares/authMiddleware.js");
const userController = require("../controllers/user.js");
const {
  register_user_validator,
  login_user_validator,
  update_user_validator,
} = require("../middlewares/validator.js");
const { validationHandler } = require("../helpers/validation.js");
const upload = require("../utils/fileUpload.js");

// ============= Register User =============
router.post(
  "/register",
  validationHandler(register_user_validator),
  userController.registerUser
);

// ============= log In =============
router.post(
  "/login",
  validationHandler(login_user_validator),
  userController.loginUser
);

// ============= Login Status =============
router.get("/login-status", userController.loginStatus);

// ============= Get User =============
router.get("/", protect, userController.getUser);

// ============= Update User =============
router.patch(
  "/update-user",
  protect,
  upload.array("photo", 1),
  validationHandler(update_user_validator),
  userController.updateUser
);

// ============= Get User By Id =============
router.get("/search/:id", protect, userController.getUserById);

// ============= Get Users By Name =============
router.post("/search/name", protect, userController.getUsersByName);

// ============= Activate User =============
router.get("/login/:token/:id", userController.activateUser);

// ============= Get All Users =============
router.get("/all", protect, userController.getAllUsers);

// ============= Delete User Account =============
router.delete("/delete/:id", protect, userController.deleteUser);
// ============= Forgot Password =============
router.post("/forgot-password", userController.forgotPassword);
// ============= Reset Password =============
router.post("/reset-password/:id", userController.resetPassword);
// ============= Order Promotion to Professor  =============
router.post(
  "/promotion-to-professor",
  protect,
  upload.array("photo", 1),
  userController.orderPromotionToProfessor
);
// ============= Online Test  =============
router.post(
  "/online-test",
  protect,
  userController.onlineTest
);
// ============= Save Grade  =============
router.post(
  "/save-grade",
  protect,
  userController.saveGrade
);
// ============= Evaluation Test  =============
router.get(
  "/evaluation-test",
  protect,
  userController.evaluationTest
);
// ============= Save Evaluation =============
router.post(
  "/save-evaluation",
  protect,
  userController.saveEvaluation
);


//  ======================  All Categories  ====================
router.get("/categories", userController.getAllCategories);


//  ======================  Get Vocabulary In Specific Category  ====================
router.get("/vocabularies/:id", userController.getVocabularyInSpecificCategory);

//  ======================  Random Test Vocabulary In Specific Category  ====================
router.post(
  "/test-vocabulary",
  protect,
  userController.randomTestVocabularyInSpecificCategory
);


module.exports = router;
