const Order = require("../models/Order.js");
const User = require("../models/User.js");

//  ======================  Answer For Teacher Promotion ====================

const answerForTeacherPromotion = async (req, res) => {
    const orderId = req.body.orderId;
    const status = req.body.status;
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(400).json({
                success: false,
                message: "Order not found !",
            });
        }
        updateOrderStatus = {
            status: status,
        }
        const newOrder = await Order.findByIdAndUpdate(
            order._id,
            { $set: updateOrderStatus },
            { new: true }
        );
        if (status === "accepted") {
            const newUser = {
                userType: "teacher",
            };
            const user = await User.findByIdAndUpdate(
                order.userId,
                { $set: newUser },
                { new: true }
            );
        }
        return res.status(201).json({
            success: true,
            message: `Order ${status} successfully !`,
        });


    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }
}
const getAllPromotions = async (req, res) => {
    try {
        const promotions = await Order.find();
        return res.status(201).json({
            success: true,
            message: `All promotions !`,
            promotions: promotions
        });


    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }
}
const adminController = {
    answerForTeacherPromotion,
    getAllPromotions
};
module.exports = adminController;
