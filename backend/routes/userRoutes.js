const express = require("express");
const {
  isAuthenticated,
  isAuthorized,
} = require("../middlewares/authMiddleware.js");
const {
  getAllUsers,
  updateUserStatus,
  getMe,
} = require("../controllers/userController.js");
const { ROLES } = require("../constants/enums.js");

const router = express.Router();

// Authentication for all the routes
router.use(isAuthenticated);

// User routes
router.get("/me", getMe);

// Admin routes (protected by RBAC)
router.get("/", isAuthorized(ROLES.ADMIN), getAllUsers);
router.patch("/:id/status", isAuthorized(ROLES.ADMIN), updateUserStatus);

module.exports = router;
