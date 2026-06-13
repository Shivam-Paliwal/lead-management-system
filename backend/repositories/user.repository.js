const { Op } = require("sequelize");
const { User, Lead, sequelize } = require("../models");
const { CLOSED_LEAD_STATUSES, USER_ROLES } = require("../utils/constants");

const userRepository = {
  create(payload, options = {}) {
    return User.create(payload, options);
  },

  count(options = {}) {
    return User.count(options);
  },

  findByEmail(email, options = {}) {
    return User.findOne({
      ...options,
      where: {
        email: String(email).toLowerCase()
      }
    });
  },

  findById(id, options = {}) {
    return User.findByPk(id, options);
  },

  findActiveAgentById(id, options = {}) {
    return User.findOne({
      ...options,
      where: {
        id,
        role: USER_ROLES.AGENT,
        isActive: true
      }
    });
  },

  findAgentsWithOpenLeadCounts(options = {}) {
    return User.findAll({
      ...options,
      where: {
        role: USER_ROLES.AGENT,
        isActive: true
      },
      attributes: {
        include: [[sequelize.fn("COUNT", sequelize.col("assignedLeads.id")), "openLeadCount"]]
      },
      include: [
        {
          model: Lead,
          as: "assignedLeads",
          attributes: [],
          required: false,
          where: {
            status: {
              [Op.notIn]: CLOSED_LEAD_STATUSES
            }
          }
        }
      ],
      group: ["User.id"],
      order: [[sequelize.literal('"openLeadCount"'), "ASC"], ["createdAt", "ASC"]]
    });
  }
};

module.exports = userRepository;

