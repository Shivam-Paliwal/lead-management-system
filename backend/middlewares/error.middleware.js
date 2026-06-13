const ApiError = require("../utils/apiError");

const normalizeError = (error) => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
    return new ApiError(
      400,
      "Validation error.",
      error.errors.map((item) => ({
        field: item.path,
        message: item.message
      }))
    );
  }

  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    return new ApiError(401, "Invalid or expired token.");
  }

  return error;
};

const errorMiddleware = (error, _req, res, _next) => {
  const normalizedError = normalizeError(error);
  const statusCode = normalizedError.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: normalizedError.message || "Internal server error.",
    errors: normalizedError.errors || [],
    stack: process.env.NODE_ENV === "production" ? undefined : normalizedError.stack
  });
};

module.exports = errorMiddleware;

