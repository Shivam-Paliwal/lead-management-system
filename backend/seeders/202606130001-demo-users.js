"use strict";

const bcrypt = require("bcrypt");
const { USER_ROLES } = require("../utils/constants");

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const users = [
      {
        name: "System Admin",
        email: "admin@example.com",
        password: await bcrypt.hash("Admin@123", 10),
        role: USER_ROLES.ADMIN,
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        name: "Sales Manager",
        email: "manager@example.com",
        password: await bcrypt.hash("Manager@123", 10),
        role: USER_ROLES.MANAGER,
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        name: "Agent One",
        email: "agent1@example.com",
        password: await bcrypt.hash("Agent@123", 10),
        role: USER_ROLES.AGENT,
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        name: "Agent Two",
        email: "agent2@example.com",
        password: await bcrypt.hash("Agent@123", 10),
        role: USER_ROLES.AGENT,
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert("users", users, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", {
      email: ["admin@example.com", "manager@example.com", "agent1@example.com", "agent2@example.com"]
    });
  }
};

