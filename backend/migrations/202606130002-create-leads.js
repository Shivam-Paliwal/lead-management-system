"use strict";

const {
  LEAD_SOURCE_VALUES,
  LEAD_SOURCES,
  LEAD_STATUS_VALUES,
  LEAD_STATUSES
} = require("../utils/constants");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("leads", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()")
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING(80)
      },
      last_name: {
        allowNull: false,
        type: Sequelize.STRING(80)
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(180)
      },
      phone: {
        allowNull: true,
        type: Sequelize.STRING(40)
      },
      company: {
        allowNull: true,
        type: Sequelize.STRING(160)
      },
      source: {
        allowNull: false,
        type: Sequelize.ENUM(...LEAD_SOURCE_VALUES),
        defaultValue: LEAD_SOURCES.OTHER
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM(...LEAD_STATUS_VALUES),
        defaultValue: LEAD_STATUSES.NEW
      },
      notes: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      assigned_to_id: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      created_by_id: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      updated_by_id: {
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

    await queryInterface.addIndex("leads", ["status"]);
    await queryInterface.addIndex("leads", ["source"]);
    await queryInterface.addIndex("leads", ["assigned_to_id"]);
    await queryInterface.addIndex("leads", ["created_at"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("leads");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_leads_source";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_leads_status";');
  }
};

