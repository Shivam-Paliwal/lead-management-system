const ApiError = require("../utils/apiError");

const notFoundMiddleware = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

module.exports = notFoundMiddleware;

