const { Router } = require("express");
const router = Router();
const { protect, protectAdmin, protectTeacher } = require("../middlewares/authMiddleware.js");
const videoController = require("../controllers/video.js");
const {
    add_video_validator,
    update_video_validator
} = require("../middlewares/validator.js");
const { validationHandler } = require("../helpers/validation.js");

const upload = require("../utils/fileUpload.js");


// ============= Add Video To Course =============
router.post(
    "/add-to-course",
    protectTeacher,
    upload.array("video", 1),
    validationHandler(add_video_validator),
    videoController.addVideo
);

// ============= Update Video From Course =============
router.patch(
    "/update-from-course",
    protectTeacher,
    upload.array("video", 1),
    validationHandler(update_video_validator),
    videoController.updateVideo
);

//  ====================== Delete Video ====================
router.delete("/delete-video/:id", protectTeacher, videoController.deleteVideo);

//  ====================== Get All Videos ====================
router.get("/:id", videoController.getAllVideos);

module.exports = router;
