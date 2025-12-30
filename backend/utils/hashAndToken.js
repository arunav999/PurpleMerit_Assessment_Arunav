// ==================== Hash Utilities ====================
// Bcrypt for password hashing
const bcrypt = require("bcrypt");

const bcryptHash = async (value) => {
  const hashedBcrypt = await bcrypt.hash(value, 12);
  return hashedBcrypt;
};

// ==================== Token Utilities ====================
// Provides functions for generating JWT and refresh tokens

// JWT for token generation
const jwt = require("jsonwebtoken");

// Generate a JWT token for a user (expires in 24h)
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRECT, {
    expiresIn: "24h",
  });
};

