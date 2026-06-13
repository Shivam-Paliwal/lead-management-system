const jwt = require("jsonwebtoken");
const { User } = require("../models");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const authenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    throw new ApiError(401, "Authentication token is required.");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findByPk(decoded.id);

  if (!user || !user.isActive) {
    throw new ApiError(401, "Invalid or inactive user.");
  }

  req.user = user;
  next();
});

const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication is required."));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action."));
    }

    return next();
  };
};

module.exports = {
  authenticate,
  authorize
};

