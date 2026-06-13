const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/database");

const User = require("./user.model")(sequelize, DataTypes);
const Lead = require("./lead.model")(sequelize, DataTypes);
const ActivityLog = require("./activityLog.model")(sequelize, DataTypes);

User.hasMany(Lead, {
  as: "assignedLeads",
  foreignKey: "assignedToId"
});
Lead.belongsTo(User, {
  as: "assignedTo",
  foreignKey: "assignedToId"
});

User.hasMany(Lead, {
  as: "createdLeads",
  foreignKey: "createdById"
});
Lead.belongsTo(User, {
  as: "createdBy",
  foreignKey: "createdById"
});

User.hasMany(Lead, {
  as: "updatedLeads",
  foreignKey: "updatedById"
});
Lead.belongsTo(User, {
  as: "updatedBy",
  foreignKey: "updatedById"
});

Lead.hasMany(ActivityLog, {
  as: "activityLogs",
  foreignKey: "leadId"
});
ActivityLog.belongsTo(Lead, {
  as: "lead",
  foreignKey: "leadId"
});

User.hasMany(ActivityLog, {
  as: "activityLogs",
  foreignKey: "actorId"
});
ActivityLog.belongsTo(User, {
  as: "actor",
  foreignKey: "actorId"
});

module.exports = {
  sequelize,
  Sequelize,
  User,
  Lead,
  ActivityLog
};

