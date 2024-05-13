const { Router } = require("express");
const router = Router();
const { protect, protectAdmin, protectTeacher } = require("../middlewares/authMiddleware.js");
const adminController = require("../controllers/admin.js");

//  ======================  Answer For Teacher Promotion ====================
router.post("/answer-for-teacher-promotion", protectAdmin, adminController.answerForTeacherPromotion);


module.exports = router;
