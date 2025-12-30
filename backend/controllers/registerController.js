// ==================== Register Controller ====================
// Handles user registration, workspace assignment, and session creation

// Error handling utility
const ApiError = require("../errors/ApiError.js");

// Redis Client
const { redisClient } = require("../config/redisClientDB.js");

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
const registerUser = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if User exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        new ApiError(STATUS_CODES.CONFLICT, "Email already in use", "email")
      );
    }

    // Check accounts
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? ROLES.ADMIN : ROLES.USER;

    // Hash password
    const passwordHash = await bcryptHash(password);

    // If new User
    const newUser = User.create({
      fullName,
      email,
      password: passwordHash,
      role,
    });

    // Create with JWT and Hash with CRYPTO
    const signUpToken = generateToken((await newUser)._id);
    const hashedSignupToken = cryptoHash(signUpToken);

    // Save in redis

    await redisClient.setEx(
      `session:${hashedSignupToken}`,
      60 * 60 * 24,
      (await newUser)._id.toString()
    );

    // Set cookie

    res.cookie("token", signUpToken, cookieOptions("24hr"));

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "User created successfully",
      user: {
        id: (await newUser)._id,
        fullName: (await newUser).fullName,
        email: (await newUser).email,
        role: (await newUser).role,
      },
    });
  } catch (error) {
    // Centeralized error handler
    next(error);
  }
};

module.exports = { registerUser };
