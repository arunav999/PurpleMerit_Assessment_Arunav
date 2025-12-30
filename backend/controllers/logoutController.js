// ==================== Logout Controller ====================
// Handles user logout, session token cleanup, and cookie removal

// Redis Client
const { redisClient } = require("../config/redisClientDB.js");

// Constants for status codes
const { STATUS_CODES } = require("../constants/statusCodes.js");

// Utility functions for hashing
const { cryptoHash } = require("../utils/hashAndToken.js");

// Util for cookie options
const { cookieOptions } = require("../utils/utils.js");

// Main logout controller
const logoutController = async (req, res, next) => {
  try {
    // Extract tokens from cookies
    const signUpToken = req.cookies?.token;
    const loginToken = req.cookies?.loginToken;

    // If no tokens are present, user is already logged out
    if (!signUpToken && !loginToken) {
      return res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Already logged out",
      });
    }

    // Remove session for signupToken
    if (signUpToken) {
      const hashedSignupToken = cryptoHash(signUpToken);

      await redisClient.del(`session:${hashedSignupToken}`);
      res.clearCookie("token", cookieOptions());
    }

    // Remove session for loginToken
    if (loginToken) {
      const hashedLoginToken = cryptoHash(loginToken);

      await redisClient.del(`session:${hashedLoginToken}`);
      res.clearCookie("loginToken", cookieOptions());
    }

    // Respond with success logout
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Logged out successfully",
      redirect: "/",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = logoutController;
