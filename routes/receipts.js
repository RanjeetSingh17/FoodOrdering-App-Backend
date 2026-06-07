const express = require("express")
const verifyToken = require("../middleware/authMiddleware")
const { getUserOrders, fetchReceipt } = require("../queries.js")

const router = express.Router()

router.get("/fetch-receipts", verifyToken, async (req, res) => {
    try {
        const { uid } = req.user
        const orders = await getUserOrders(uid)
        return res.status(200).json(orders)
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({
            success: false,
            message: "Unable to fetch your receipts, please try again later",
        })
    }
})

router.post("/get-receipt", verifyToken, async (req, res) => {
    try {
        const { uid } = req.user
        const { order_id } = req.body
        if (!order_id) {
            throw new Error("order_id is required")
        }
        const { result_order, result_items } = await fetchReceipt(uid, order_id)
        if (!result_order) {
            return res.status(400).json({
                error: "The requested order id does not belong to the user",
            })
        }
        res.json({ result_items, result_order })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            error: "Internal server error, please try again later",
        })
    }
})

module.exports = router
