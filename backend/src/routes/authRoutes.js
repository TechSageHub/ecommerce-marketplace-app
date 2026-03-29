const express = require("express");
const {
  loginAdmin,
  logoutAdmin,
  registerCustomer,
  loginCustomer,
  getCurrentUser,
} = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/customer/login", loginCustomer);
router.post("/register", registerCustomer);
router.get("/me", protect, getCurrentUser);
router.post("/logout", protect, adminOnly, logoutAdmin);

module.exports = router;
