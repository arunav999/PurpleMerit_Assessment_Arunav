// ==================== Auth Routes ====================
// Handles user authentication, registration, login, and profile endpoints
const { Router } = require("express");

// ==================== Middleware ====================
// Protect routes with authentication middleware

// Rate limiter middleware to prevent abuse

// ==================== Validators ====================
// Validate registration and login requests
const validateNewUser = require("../validators/registerUserValidator.js");

// ==================== Controllers ====================
// Controller functions for each auth endpoint
const registerUser = require("../controllers/registerController.js");

// Create a new router instance
const router = Router();

// ==================== Route Definitions ====================
// Register a new user
router.post("/register", validateNewUser, registerUser);

// Login an existing user
// router.post("/login");

// Check if a user email-exists
// router.get("/check-email");

// Get the authenticated user's profile
// router.get("/getUser");

// Logout the authenticated user
// router.post("/logout");

module.exports = router;
