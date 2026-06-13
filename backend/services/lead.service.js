const { sequelize } = require("../models");
const leadRepository = require("../repositories/lead.repository");
const userRepository = require("../repositories/user.repository");
const activityLogService = require("./activityLog.service");
const assignmentService = require("./assignment.service");
const ApiError = require("../utils/apiError");
const { ACTIVITY_ACTIONS, USER_ROLES } = require("../utils/constants");
const { buildPaginationMeta, getPagination } = require("../utils/pagination");

const editableLeadFields = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "company",
  "source",
  "status",
  "notes",
  "assignedToId"
];

const pickEditableFields = (payload) => {
  return editableLeadFields.reduce((result, field) => {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      result[field] = payload[field];
    }

    return result;
  }, {});
};

const assertLeadAccess = (lead, currentUser) => {
  if (!lead) {
    throw new ApiError(404, "Lead not found.");
  }

  if (currentUser.role === USER_ROLES.AGENT && lead.assignedToId !== currentUser.id) {
    throw new ApiError(403, "You can only access leads assigned to you.");
  }
};

const leadService = {
  async create(payload, currentUser) {
    const assigneeId = await assignmentService.resolveAssignee({
      requestedAssigneeId: payload.assignedToId,
      currentUser
    });

    return sequelize.transaction(async (transaction) => {
      const lead = await leadRepository.create(
        {
          ...pickEditableFields(payload),
          assignedToId: assigneeId,
          createdById: currentUser.id,
          updatedById: currentUser.id
        },
        { transaction }
      );

      await activityLogService.record(
        {
          leadId: lead.id,
          actorId: currentUser.id,
          action: ACTIVITY_ACTIONS.LEAD_CREATED,
          message: "Lead created.",
          metadata: {
            status: lead.status,
            source: lead.source
          }
        },
        { transaction }
      );

      if (assigneeId) {
        await activityLogService.record(
          {
            leadId: lead.id,
            actorId: currentUser.id,
            action: ACTIVITY_ACTIONS.LEAD_ASSIGNED,
            message: "Lead assigned.",
            metadata: {
              assignedToId: assigneeId
            }
          },
          { transaction }
        );
      }

      return leadRepository.findById(lead.id, { transaction });
    });
  },

  async update(id, payload, currentUser) {
    const lead = await leadRepository.findById(id);
    assertLeadAccess(lead, currentUser);

    const updates = pickEditableFields(payload);
    const previousStatus = lead.status;
    const previousAssigneeId = lead.assignedToId;

    if (Object.prototype.hasOwnProperty.call(updates, "assignedToId")) {
      if (currentUser.role === USER_ROLES.AGENT) {
        throw new ApiError(403, "Agents cannot reassign leads.");
      }

      if (updates.assignedToId) {
        const assignee = await userRepository.findActiveAgentById(updates.assignedToId);

        if (!assignee) {
          throw new ApiError(400, "Assigned user must be an active agent.");
        }
      }
    }

    updates.updatedById = currentUser.id;

    return sequelize.transaction(async (transaction) => {
      const updatedLead = await leadRepository.update(lead, updates, { transaction });

      await activityLogService.record(
        {
          leadId: lead.id,
          actorId: currentUser.id,
          action: ACTIVITY_ACTIONS.LEAD_UPDATED,
          message: "Lead updated.",
          metadata: {
            fields: Object.keys(updates).filter((field) => field !== "updatedById")
          }
        },
        { transaction }
      );

      if (updates.status && updates.status !== previousStatus) {
        await activityLogService.record(
          {
            leadId: lead.id,
            actorId: currentUser.id,
            action: ACTIVITY_ACTIONS.STATUS_CHANGED,
            message: "Lead status changed.",
            metadata: {
              from: previousStatus,
              to: updates.status
            }
          },
          { transaction }
        );
      }

      if (
        Object.prototype.hasOwnProperty.call(updates, "assignedToId") &&
        updates.assignedToId !== previousAssigneeId
      ) {
        await activityLogService.record(
          {
            leadId: lead.id,
            actorId: currentUser.id,
            action: ACTIVITY_ACTIONS.LEAD_ASSIGNED,
            message: "Lead assignment changed.",
            metadata: {
              from: previousAssigneeId,
              to: updates.assignedToId || null
            }
          },
          { transaction }
        );
      }

      return updatedLead;
    });
  },

  async remove(id, currentUser) {
    const lead = await leadRepository.findById(id);
    assertLeadAccess(lead, currentUser);
    await leadRepository.delete(lead);
  },

  async getById(id, currentUser) {
    const lead = await leadRepository.findById(id);
    assertLeadAccess(lead, currentUser);
    return lead;
  },

  async list(query, currentUser) {
    const { page, limit, offset } = getPagination(query);
    const result = await leadRepository.list({
      page,
      limit,
      offset,
      search: query.search,
      status: query.status,
      source: query.source,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      assignedToId: currentUser.role === USER_ROLES.AGENT ? currentUser.id : query.assignedToId
    });

    return {
      leads: result.rows,
      pagination: buildPaginationMeta({
        count: result.count,
        page,
        limit
      })
    };
  },

  async listActivity(id, currentUser) {
    const lead = await leadRepository.findById(id);
    assertLeadAccess(lead, currentUser);
    return activityLogService.listByLeadId(id);
  }
};

module.exports = leadService;

