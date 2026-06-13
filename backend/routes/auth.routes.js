const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("A valid email is required.").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
  ],
  validate,
  authController.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("A valid email is required.").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required.")
  ],
  validate,
  authController.login
);

router.get("/me", authenticate, authController.me);
router.post("/logout", authenticate, authController.logout);

module.exports = router;

