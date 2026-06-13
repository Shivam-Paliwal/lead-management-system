"use strict";

const { USER_ROLE_VALUES, USER_ROLES } = require("../utils/constants");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()")
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(120)
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(180)
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      role: {
        allowNull: false,
        type: Sequelize.ENUM(...USER_ROLE_VALUES),
        defaultValue: USER_ROLES.AGENT
      },
      is_active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("users");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
  }
};
