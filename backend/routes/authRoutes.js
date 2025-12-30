// ==================== Auth Routes ====================
// Handles user authentication, registration, login, and profile endpoints
const { Router } = require("express");

// ==================== Middleware ====================
// Protect routes with authentication middleware

// Rate limiter middleware to prevent abuse

// ==================== Validators ====================
// Validate registration and login requests

// ==================== Controllers ====================
// Controller functions for each auth endpoint

// Create a new router instance
const router = Router();

// ==================== Route Definitions ====================
// Register a new user
router.post("/register");

// Login an existing user
router.post("/login");

// Check if a user email-exists
router.get("/check-email");

// Get the authenticated user's profile
router.get("/getUser", (req, res) => {
  res.send({ success: true, message: "This route is working" });
});

// Logout the authenticated user
router.post("/logout");

module.exports = router;
