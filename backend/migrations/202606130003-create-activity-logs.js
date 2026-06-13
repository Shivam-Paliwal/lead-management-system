"use strict";

const { ACTIVITY_ACTION_VALUES } = require("../utils/constants");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("activity_logs", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()")
      },
      action: {
        allowNull: false,
        type: Sequelize.ENUM(...ACTIVITY_ACTION_VALUES)
      },
      message: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      metadata: {
        allowNull: false,
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      lead_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "leads",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      actor_id: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
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

    await queryInterface.addIndex("activity_logs", ["lead_id"]);
    await queryInterface.addIndex("activity_logs", ["actor_id"]);
    await queryInterface.addIndex("activity_logs", ["created_at"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("activity_logs");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_activity_logs_action";');
  }
};

