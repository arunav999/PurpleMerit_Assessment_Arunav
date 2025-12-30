// ==================== Register Controller ====================
// Handles user registration, workspace assignment, and session creation

// Error handling utility
const ApiError = require("../errors/ApiError.js");

// Redis Client
const {} = require("../config/redisClientDB.js");

// Constants for status codes and roles
const { ROLES } = require("../constants/enums.js");
const { STATUS_CODES } = require("../constants/statusCodes.js");

// Model for User
const User = require("../models/User.js");

// Utility functions for token and password hashing
const {
  bcryptHash,
  cryptoHash,
  generateToken,
} = require("../utils/hashAndToken.js");

// Util for cookie options
const { cookieOptions } = require("../utils/utils.js");

// Main registration controller