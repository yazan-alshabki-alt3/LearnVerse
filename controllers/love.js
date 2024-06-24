const Love = require("../models/Love.js");
const Video = require('../models/Video.js');

//  ====================== Add Love ====================

const addLove = async (req, res) => {
    const videoId = req.body.videoId;
    const userId = req.user._id;
    try {
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({
                success: false,
                message: `Video not found !`,
            });
        }
        const love = await Love.create({
            videoId: videoId,
            userId: userId
        });
        return res.status(201).json({
            success: true,
            message: `Love added successfully !`,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }
}

//  ====================== Remove Love ====================

const removeLove = async (req, res) => {
    const loveId = req.params.id;
    const userId = req.user._id;

    try {
        const love = await Love.findById(loveId);
        if (!love) {
            return res.status(404).json({
                success: false,
                message: `love not found !`,
            });
        }
        if (love.userId.toHexString() !== userId.toHexString()) {
            return res.status(400).json({
                success: false,
                message: `love is not yours' !`,
            });
        }

        let deleteLove = await Love.findByIdAndDelete(loveId);
        return res.status(201).json({
            success: true,
            message: `The love has deleted successfully !`,
        });


    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }
}

//  ====================== Get User's Loves ====================


const getLoveForUser = async (req, res) => {
    const userId = req.user._id;
    try {
        const loves = await Love.find({ userId: userId });
        return res.status(200).json({
            success: true,
            message: `All videos in your love bag `,
            data: loves,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }
}

const loveController = {
    addLove,
    removeLove,
    getLoveForUser,
};
module.exports = loveController;
