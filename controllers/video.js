const Video = require('../models/Video.js');
const Course = require('../models/Course.js');
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

//  ====================== Add Video ====================

const addVideo = async (req, res) => {
    const teacherId = req.user._id;
    const title = req.body.title;
    const courseId = req.body.courseId;
    let url;
    if (req.files.length > 0) {
        const result = await cloudinary.uploader.upload(req.files[0].path, {
            resource_type: "video",
        });
        url = result.secure_url;
    } else {
        return res.status(404).json({
            success: false,
            message: "Video file is empty !",
        });
    }
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "The course is not found !",
            });
        }
        if (course.teacherId.toString() !== teacherId.toString()) {
            return res.status(400).json({
                success: false,
                message: "The course is not yours' you can not add video !",
            });
        }
        const video = await Video.create({
            teacherId: teacherId,
            title: title,
            courseId: courseId,
            url: url
        });
        return res.status(201).json({
            success: true,
            message: "Video added successfully !",
            data: video,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }
}

//  ====================== Update Video ====================

const updateVideo = async (req, res) => {
    const teacherId = req.user._id;
    const title = req.body.title;
    const videoId = req.body.videoId;
    let url = null;
    if (req.files.length > 0) {
        const result = await cloudinary.uploader.upload(req.files[0].path, {
            resource_type: "video",
        });
        url = result.secure_url;
    }
    try {
        const oldVideo = await Video.findById(videoId);
        if (!oldVideo) {
            return res.status(404).json({
                success: false,
                message: "The video is not found !",
            });
        }


        const course = await Course.findById(oldVideo.courseId);

        if (course.teacherId.toString() !== teacherId.toString()) {
            return res.status(400).json({
                success: false,
                message: "The course is not yours' you can not update video !",
            });
        }
        let newVideo;
        if (url) {
            newVideo = {
                title: title,
                url: url
            };
        } else {
            newVideo = {
                title: title,
            };
        }
        const video = await Video.findByIdAndUpdate(
            videoId,
            { $set: newVideo },
            { new: true }
        );
        return res.status(201).json({
            success: true,
            message: "Video updated successfully !",
            data: video,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }
}

//  ====================== Delete Video ====================

const deleteVideo = async (req, res) => {
    const videoId = req.params.id;
    try {
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({
                success: false,
                message: `video not found !`,
            });
        }
        const courseOwner = await Course.findById(video.courseId);
        if (courseOwner.teacherId.toString() != req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "The course is not yours' !",
            });
        }
        let deleteVideo = await Video.findByIdAndDelete(videoId);
        return res.status(200).json({
            success: true,
            message: `The video has deleted successfully !`,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }
}

//  ====================== Get All Videos ====================

const getAllVideos = async (req, res) => {
    const courseId = req.params.id;
    try {
        const videos = await Video.find({ courseId: courseId });
        return res.status(200).json({
            success: true,
            message: `All videos in this course  `,
            data: videos,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }
};


const videoController = {
    addVideo,
    updateVideo,
    deleteVideo,
    getAllVideos
};
module.exports = videoController;
