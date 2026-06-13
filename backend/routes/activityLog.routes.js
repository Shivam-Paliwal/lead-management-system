const express = require("express");
const { query } = require("express-validator");
const activityLogController = require("../controllers/activityLog.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { USER_ROLES } = require("../utils/constants");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive number."),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100.")
  ],
  validate,
  activityLogController.list
);

module.exports = router;

