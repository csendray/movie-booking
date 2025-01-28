// moviebooking/routes/user.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Route to sign up a user
router.post("/auth/signup", userController.signUp);

// Route to log in a user
router.post("/auth/login", userController.login);

// Route to log out a user
router.post("/auth/logout", authMiddleware, userController.logout);

// Route to get coupons for a specific user (GET)
// 🏷 Secure Routes with `authMiddleware`
router.get("/auth/coupons", authMiddleware, userController.getCouponCode);
router.post("/auth/bookings", authMiddleware, userController.bookShow);

module.exports = router;
