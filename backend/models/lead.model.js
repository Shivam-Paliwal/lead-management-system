const {
  LEAD_SOURCE_VALUES,
  LEAD_SOURCES,
  LEAD_STATUS_VALUES,
  LEAD_STATUSES
} = require("../utils/constants");

module.exports = (sequelize, DataTypes) => {
  const Lead = sequelize.define(
    "Lead",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      firstName: {
        type: DataTypes.STRING(80),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      lastName: {
        type: DataTypes.STRING(80),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      email: {
        type: DataTypes.STRING(180),
        allowNull: false,
        validate: {
          isEmail: true,
          notEmpty: true
        },
        set(value) {
          this.setDataValue("email", String(value).toLowerCase());
        }
      },
      phone: {
        type: DataTypes.STRING(40),
        allowNull: true
      },
      company: {
        type: DataTypes.STRING(160),
        allowNull: true
      },
      source: {
        type: DataTypes.ENUM(...LEAD_SOURCE_VALUES),
        allowNull: false,
        defaultValue: LEAD_SOURCES.OTHER
      },
      status: {
        type: DataTypes.ENUM(...LEAD_STATUS_VALUES),
        allowNull: false,
        defaultValue: LEAD_STATUSES.NEW
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      assignedToId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      createdById: {
        type: DataTypes.UUID,
        allowNull: true
      },
      updatedById: {
        type: DataTypes.UUID,
        allowNull: true
      }
    },
    {
      tableName: "leads",
      underscored: true,
      timestamps: true
    }
  );

  return Lead;
};

