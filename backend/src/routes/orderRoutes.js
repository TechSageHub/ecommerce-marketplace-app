const express = require("express");
const {
  createOrder,
  getOrders,
  getMyOrders,
  getOrdersByEmail,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createOrder);
router.get("/lookup", getOrdersByEmail);
router.get("/my-orders", protect, getMyOrders);
router.get("/", protect, adminOnly, getOrders);
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
