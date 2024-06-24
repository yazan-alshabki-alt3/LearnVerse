const Subscribe = require("../models/Subscribe.js");
const Course = require('../models/Course.js');

//  ====================== Add Subscribe ====================

const addSubscribe = async (req, res) => {
    const courseId = req.body.courseId;
    const userId = req.user._id;
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: `Course not found !`,
            });
        }
        const subscribe = await Subscribe.create({
            courseId: courseId,
            userId: userId
        });
        return res.status(201).json({
            success: true,
            message: `Subscribe added successfully !`,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }
}

//  ====================== Remove Subscribe ====================

const removeSubscribe = async (req, res) => {
    const subscribeId = req.params.id;
    const userId = req.user._id;

    try {
        const subscribe = await Subscribe.findById(subscribeId);
        if (!subscribe) {
            return res.status(404).json({
                success: false,
                message: `Subscribe not found !`,
            });
        }
        if (subscribe.userId.toHexString() !== userId.toHexString()) {
            return res.status(400).json({
                success: false,
                message: `Subscribe is not yours' !`,
            });
        }

        let deleteSubscribe = await Subscribe.findByIdAndDelete(subscribeId);
        return res.status(201).json({
            success: true,
            message: `The Subscribe has deleted successfully !`,
        });


    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }
}

//  ====================== Get User's Subscribes ====================


const getSubscribeForUser = async (req, res) => {
    const userId = req.user._id;
    try {
        const subscribes = await Subscribe.find({ userId: userId });
        return res.status(200).json({
            success: true,
            message: `All courses in your Subscribe bag `,
            data: subscribes,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }
}

const SubscribeController = {
    addSubscribe,
    removeSubscribe,
    getSubscribeForUser,
};
module.exports = SubscribeController;
