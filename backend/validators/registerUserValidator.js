// ==================== Register User Validator ====================
// Validates registration request body for required fields and correct format

// Error handling utility
const ApiError = require("../errors/ApiError.js");

// Status code constants, roles, and regex
const { STATUS_CODES } = require("../constants/statusCodes.js");
const { REGX } = require("../constants/regx.js");
const { ROLES } = require("../constants/enums.js");

// Middleware to validate register user input
const registerUserValidator = (req, res, next) => {
  // Extract registration fields from request body
  const { fullName, email, password, confirmPassword } = req.body;

  // Presence check: first name
  if (!fullName)
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "First name is required",
        "firstName"
      )
    );

  // Presence check: email
  if (!email)
    return next(
      new ApiError(STATUS_CODES.BAD_REQUEST, "Email is required", "email")
    );

  // Presence check: password
  if (!password)
    return next(
      new ApiError(STATUS_CODES.BAD_REQUEST, "Password is required", "password")
    );

  // Presence check: confirm password
  if (!confirmPassword)
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Confirm password is required",
        "confirmPassword"
      )
    );

  // Password match check
  if (password.trim() !== confirmPassword.trim())
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Passwords do not match",
        "confirmPassword"
      )
    );

  // ===== CONTENT VALIDATION =====
  let fullNameSanitized = fullName.trim();
  let emailSanitized = email.trim().toLowerCase();
  let passwordSanitized = password.trim();

  // check length
  if (fullNameSanitized.length < 3)
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "First name must be atleast 3 characters",
        "firstName"
      )
    );

  if (emailSanitized.length < 5)
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Email must be 5 characters",
        "email"
      )
    );

  // Check only letters
  if (!REGX.NAME.test(fullNameSanitized))
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Name must contain only letters (no numbers or symbols)",
        "fullName"
      )
    );

  if (!REGX.EMAIL.test(emailSanitized))
    return next(
      new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid email format", "email")
    );

  if (!REGX.PASSWORD.test(passwordSanitized))
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Password must be 8-15 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        "password"
      )
    );

  // Overwrite req.body
  req.body.fullName = fullNameSanitized;
  req.body.email = emailSanitized;
  req.body.password = passwordSanitized;

  // Next middleware/controller
  next();
};

module.exports = registerUserValidator;
