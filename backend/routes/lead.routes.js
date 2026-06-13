const express = require("express");
const { body, param, query } = require("express-validator");
const leadController = require("../controllers/lead.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  LEAD_SOURCE_VALUES,
  LEAD_STATUS_VALUES,
  USER_ROLES
} = require("../utils/constants");

const router = express.Router();

const leadBodyValidators = [
  body("firstName").optional().trim().notEmpty().withMessage("First name cannot be empty."),
  body("lastName").optional().trim().notEmpty().withMessage("Last name cannot be empty."),
  body("email").optional().isEmail().withMessage("A valid lead email is required.").normalizeEmail(),
  body("phone").optional({ nullable: true }).trim(),
  body("company").optional({ nullable: true }).trim(),
  body("source").optional().isIn(LEAD_SOURCE_VALUES).withMessage("Invalid lead source."),
  body("status").optional().isIn(LEAD_STATUS_VALUES).withMessage("Invalid lead status."),
  body("notes").optional({ nullable: true }).trim(),
  body("assignedToId").optional({ nullable: true }).isUUID().withMessage("Assigned user must be a UUID.")
];

router.use(authenticate);

router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive number."),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100."),
    query("status").optional().isIn(LEAD_STATUS_VALUES).withMessage("Invalid status filter."),
    query("source").optional().isIn(LEAD_SOURCE_VALUES).withMessage("Invalid source filter."),
    query("sortOrder").optional().isIn(["ASC", "DESC", "asc", "desc"]).withMessage("Invalid sort order."),
    query("assignedToId").optional().isUUID().withMessage("Assigned user filter must be a UUID.")
  ],
  validate,
  leadController.list
);

router.post(
  "/",
  [
    body("firstName").trim().notEmpty().withMessage("First name is required."),
    body("lastName").trim().notEmpty().withMessage("Last name is required."),
    body("email").isEmail().withMessage("A valid lead email is required.").normalizeEmail(),
    ...leadBodyValidators
  ],
  validate,
  leadController.create
);

router.get("/:id/activity", [param("id").isUUID().withMessage("Lead id must be a UUID.")], validate, leadController.activity);

router.get("/:id", [param("id").isUUID().withMessage("Lead id must be a UUID.")], validate, leadController.getById);

router.put(
  "/:id",
  [param("id").isUUID().withMessage("Lead id must be a UUID."), ...leadBodyValidators],
  validate,
  leadController.update
);

router.delete(
  "/:id",
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  [param("id").isUUID().withMessage("Lead id must be a UUID.")],
  validate,
  leadController.remove
);

module.exports = router;

