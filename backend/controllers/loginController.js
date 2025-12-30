// ==================== Login Controller ====================
// Handles user login, session token creation and cookie management

// Bcrypt for password comparison
const bcrypt = require("bcrypt");

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
const { cryptoHash, generateToken } = require("../utils/hashAndToken.js");

// Util for cookie options
const { cookieOptions } = require("../utils/utils.js");

// Main login controller
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email }).select("+password");

    // If user not found and password miss-match
    if (!user || !(await bcrypt.compare(password, user?.password))) {
      return next(
        new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          "Invalid email or password",
          "login"
        )
      );
    }

    // Check status
    if (user?.status === USER_STATUS.INACTIVE) {
      return next(
        new ApiError(
          STATUS_CODES.FORBIDDEN,
          "Account is de-activated. Contact Admin"
        )
      );
    }

    // Generate token and hashing
    const loginToken = generateToken(user._id);
    const hashedLoginToken = cryptoHash(loginToken);

    // Save in redis
    await redisClient.setEx(
      `session:${hashedLoginToken}`,
      60 * 60 * 24,
      user._id.toString()
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Set cookie
    res.cookie("token", loginToken, cookieOptions("24hr"));

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = loginUser;
