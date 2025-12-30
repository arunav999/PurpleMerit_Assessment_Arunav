// ==================== Auth Middleware ====================
// Protects routes by verifying JWT token and session validity
const jwt = require("jsonwebtoken");

// Redis Client
const { redisClient } = require("../config/redisClientDB.js");

// Error handling utility
const ApiError = require("../errors/ApiError.js");

// Status code enums
const { STATUS_CODES } = require("../constants/statusCodes.js");
const { USER_STATUS } = require("../constants/enums.js");

// User Model
const User = require("../models/User.js");

// Utility functions for token generation and hashing
const { cryptoHash } = require("../utils/hashAndToken.js");

// Check if user is logged in
exports.isAuthenticated = async (req, res, next) => {
  try {
    // Check for token
    const token =
      req.cookies?.token ||
      req.cookies?.loginToken ||
      req.headers?.authorization?.split(" ")[1];

    // if no token
    if (!token) {
      return next(
        new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          "Not authorized. No token provided. Please login again",
          ""
        )
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return next(
        new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid or expired token", "")
      );
    }

    // check with redis
    const hashedToken = cryptoHash(token);
    const sessionUserId = await redisClient.get(`session:${hashedToken}`);

    if (!sessionUserId) {
      return next(
        new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          "Session expired. Please login again",
          ""
        )
      );
    }

    // Attach user and check status
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new ApiError(STATUS_CODES.NOT_FOUND, "User not found", ""));
    }

    // Check account active
    if (user.status === USER_STATUS.INACTIVE) {
      return next(
        new ApiError(
          STATUS_CODES.FORBIDDEN,
          "Your account is de-activated. Contact admin"
        )
      );
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Implementing RBAC
exports.isAuthorized = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          STATUS_CODES.FORBIDDEN,
          `Access Denied. Role '${req.user.role}' is not authorized`
        )
      );
    }
    next();
  };
};
