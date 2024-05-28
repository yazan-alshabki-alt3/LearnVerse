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

//  ====================== Update Course ====================

const updateCourse = async (req, res) => {
    const courseId = req.body.courseId;
    const newCourse = {
        name: req.body.name,
        description: req.body.description,
        level: req.body.level,
    };
    try {
        const courseOwner = await Course.findById(courseId);
        if (!courseOwner) {
            return res.status(404).json({
                success: false,
                message: `course not found !`,
            });
        }
        if (courseOwner.teacherId.toString() != req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "The course is not yours' !",
            });
        }
        const course = await Course.findByIdAndUpdate(
            courseId,
            { $set: newCourse },
            { new: true }
        );
        const userData = {
            _id: course._id,
            name: course.name,
            description: course.description,
            level: course.level,
            teacherId: course.teacherId,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
        };
        return res.status(201).json({
            success: true,
            message: "Course Updated Successfully",
            data: userData,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }
}

//  ====================== Delete Course ====================

const deleteCourse = async (req, res) => {
    const courseId = req.params.id;
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: `course not found !`,
            });
        }
        const courseOwner = await Course.findById(courseId);
        if (courseOwner.teacherId.toString() != req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "The course is not yours' !",
            });
        }
        let deleteCourse = await Course.findByIdAndDelete(courseId);
        return res.status(200).json({
            success: true,
            message: `The course has deleted successfully !`,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }
}

//  ====================== Get All Courses ====================

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        return res.status(200).json({
            success: true,
            message: `All courses in our website  `,
            data: courses,
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

};
module.exports = videoController;
