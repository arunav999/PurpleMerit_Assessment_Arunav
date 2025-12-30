// ==================== Hash Utilities ====================
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const bcryptHash = async (value) => {
  const hashedBcrypt = await bcrypt.hash(value, 12);
  return hashedBcrypt;
};

const cryptoHash = (value) => {
  const hashedCrypto = crypto
    .createHash("sha3-256")
    .update(value)
    .digest("hex");

  return hashedCrypto;
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

module.exports = { bcryptHash, cryptoHash, generateToken };
