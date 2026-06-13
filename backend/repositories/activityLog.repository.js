const { ActivityLog, Lead, User } = require("../models");

const activityIncludes = [
  { model: User, as: "actor", attributes: ["id", "name", "email", "role"] },
  { model: Lead, as: "lead", attributes: ["id", "firstName", "lastName", "email", "status"] }
];

const activityLogRepository = {
  create(payload, options = {}) {
    return ActivityLog.create(payload, options);
  },

  listByLeadId(leadId, options = {}) {
    return ActivityLog.findAll({
      ...options,
      where: {
        leadId
      },
      include: activityIncludes,
      order: [["createdAt", "DESC"]]
    });
  },

  list({ limit = 50, offset = 0 } = {}) {
    return ActivityLog.findAndCountAll({
      include: activityIncludes,
      limit,
      offset,
      distinct: true,
      order: [["createdAt", "DESC"]]
    });
  }
};

module.exports = activityLogRepository;

