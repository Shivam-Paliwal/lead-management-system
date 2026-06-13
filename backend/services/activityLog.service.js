const activityLogRepository = require("../repositories/activityLog.repository");

const activityLogService = {
  record(payload, options = {}) {
    return activityLogRepository.create(payload, options);
  },

  listByLeadId(leadId, options = {}) {
    return activityLogRepository.listByLeadId(leadId, options);
  },

  list(params = {}) {
    return activityLogRepository.list(params);
  }
};

module.exports = activityLogService;

