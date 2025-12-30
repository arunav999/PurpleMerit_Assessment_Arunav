const User = require("../models/User.js");
const ApiError = require("../errors/ApiError.js");
const { STATUS_CODES } = require("../constants/statusCodes.js");
const { USER_STATUS } = require("../constants/enums.js");

// Get current user profile
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(STATUS_CODES.OK).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (Admin function) - with pagination
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // new data first

    const total = await User.countDocuments();

    res.status(STATUS_CODES.OK).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Update user status (Admin function)
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // validation
    if (!Object.values(USER_STATUS).includes(status)) {
      return next(
        new ApiError(
          STATUS_CODES.BAD_REQUEST,
          "Status must be 'active' or 'in-active'"
        )
      );
    }

    // Admin cannot de-activate themselves
    if (req.user._id.toString() === id) {
      return next(
        new ApiError(
          STATUS_CODES.BAD_REQUEST,
          "You cannot deactivate your own admin account"
        )
      );
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return next(new ApiError(STATUS_CODES.NOT_FOUND, "User not found"));
    }

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: `User status updated to ${status}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};
