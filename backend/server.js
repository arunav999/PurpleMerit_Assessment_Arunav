// ==================== 3rd-party imports ====================
// External libraries and environment setup
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// ==================== Database Connection ====================
// Connect to MongoDB using Mongoose
const purpleMeritDB = require("./config/db.js");

// ==================== Import Routes ====================
// Modular route imports for different features

// ==================== Error Handler ====================
// Centralized error handling middleware

// ==================== Express App Setup ====================
const app = express();

// Trust proxy when in production (important for IPs, HTTPS, rate limiting, etc.)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", true);
}

// Redirect HTTP to HTTPS — only in production
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.secure || req.headers["x-forwarded-proto"] === "https") {
      return next();
    }

    res.redirect(`https://${req.headers.host}${req.url}`);
  });
}

// ==================== Global Middlewares ====================
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// ==================== CORS Middleware ====================
// Allow cross-origin requests from client
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL],
    credentials: true,
  })
);

// ==================== Connect to Database ====================
purpleMeritDB(); // Mongo

// ==================== API Routes ====================
// Mount feature routes under /api/v1

const baseRoute = "/api/v1";

// ==================== Error Middleware ====================
// Handle errors from all routes and controllers

// ==================== Start Server ====================
// Start listening for incoming requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
