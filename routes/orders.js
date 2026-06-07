const express = require("express")
const crypto = require("crypto")
const { addOrder, addOrderItems, updateOrderStatus } = require("../queries.js")
const verifyToken = require("../middleware/authMiddleware.js")

const router = express.Router()

router.post("/place", verifyToken, async (req, res) => {
    try {
        const { amount, serviceCharge, items } = req.body

        if (!amount || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid request: amount and items are required",
            })
        }

        const parsedAmount = Number(amount)
        const parsedServiceCharge = Number(serviceCharge) || 0

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount",
            })
        }

        const pooledItems = Object.values(
            items.reduce((acc, { item_id, quantity }) => {
                acc[item_id] = acc[item_id] || { item_id, quantity: 0 }
                acc[item_id].quantity += quantity
                return acc
            }, {})
        )

        const { uid } = req.user
        const orderId = `order_${crypto.randomBytes(8).toString("hex")}`

        await addOrder(orderId, uid, parsedAmount, parsedServiceCharge)
        await addOrderItems(orderId, pooledItems)
        await updateOrderStatus(orderId, "PAID")

        return res.status(200).json({
            success: true,
            order: { id: orderId },
        })
    } catch (error) {
        console.error("Error placing order:", error)
        return res.status(500).json({
            success: false,
            message: "Error placing order, please try again later",
        })
    }
})

module.exports = router
