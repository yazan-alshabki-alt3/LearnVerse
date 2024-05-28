const { Router } = require("express");
const router = Router();
const { protect, protectAdmin, protectTeacher } = require("../middlewares/authMiddleware.js");
const videoController = require("../controllers/video.js");
const {
    add_and_update_video_validator
} = require("../middlewares/validator.js");
const { validationHandler } = require("../helpers/validation.js");

const upload = require("../utils/fileUpload.js");


// ============= Add Video To Course =============
router.post(
    "/add-to-course",
    protectTeacher,
    upload.array("video", 1),
    validationHandler(add_and_update_video_validator),
    videoController.addVideo
);

module.exports = router;
