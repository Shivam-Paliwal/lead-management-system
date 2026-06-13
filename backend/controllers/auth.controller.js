const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");

const authController = {
  register: asyncHandler(async (req, res) => {
    const data = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      data
    });
  }),

  login: asyncHandler(async (req, res) => {
    const data = await authService.login(req.body);

    res.json({
      success: true,
      message: "Login successful.",
      data
    });
  }),

  me: asyncHandler(async (req, res) => {
    const user = await authService.getCurrentUser(req.user.id);

    res.json({
      success: true,
      data: {
        user
      }
    });
  }),

  logout: asyncHandler(async (_req, res) => {
    res.json({
      success: true,
      message: "Logout successful."
    });
  })
};

module.exports = authController;

