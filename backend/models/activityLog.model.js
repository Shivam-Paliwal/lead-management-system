const { ACTIVITY_ACTION_VALUES } = require("../utils/constants");

module.exports = (sequelize, DataTypes) => {
  const ActivityLog = sequelize.define(
    "ActivityLog",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      action: {
        type: DataTypes.ENUM(...ACTIVITY_ACTION_VALUES),
        allowNull: false
      },
      message: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {}
      },
      leadId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      actorId: {
        type: DataTypes.UUID,
        allowNull: true
      }
    },
    {
      tableName: "activity_logs",
      underscored: true,
      timestamps: true
    }
  );

  return ActivityLog;
};

