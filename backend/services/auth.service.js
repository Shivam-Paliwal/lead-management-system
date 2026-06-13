const userRepository = require("../repositories/user.repository");
const ApiError = require("../utils/apiError");
const { generateToken } = require("../utils/jwt");
const { USER_ROLES } = require("../utils/constants");

const authService = {
  async register({ name, email, password }) {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new ApiError(409, "A user with this email already exists.");
    }

    const userCount = await userRepository.count();
    const role = userCount === 0 ? USER_ROLES.ADMIN : USER_ROLES.AGENT;

    const user = await userRepository.create({
      name,
      email,
      password,
      role
    });

    return {
      user,
      token: generateToken(user)
    };
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);

    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, "Invalid email or password.");
    }

    if (!user.isActive) {
      throw new ApiError(403, "This account is inactive.");
    }

    return {
      user,
      token: generateToken(user)
    };
  },

  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);

    if (!user || !user.isActive) {
      throw new ApiError(404, "User not found.");
    }

    return user;
  }
};

module.exports = authService;

