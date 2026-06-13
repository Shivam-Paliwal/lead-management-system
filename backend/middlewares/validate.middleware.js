const { validationResult } = require("express-validator");
const ApiError = require("../utils/apiError");

const validate = (req, _res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  return next(
    new ApiError(
      422,
      "Request validation failed.",
      result.array().map((error) => ({
        field: error.path,
        message: error.msg
      }))
    )
  );
};

module.exports = validate;

