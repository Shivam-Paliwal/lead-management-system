const userRepository = require("../repositories/user.repository");
const ApiError = require("../utils/apiError");
const { USER_ROLES } = require("../utils/constants");

const assignmentService = {
  async getLeastLoadedAgent(options = {}) {
    const agents = await userRepository.findAgentsWithOpenLeadCounts(options);
    return agents[0] || null;
  },

  async resolveAssignee({ requestedAssigneeId, currentUser }, options = {}) {
    if (currentUser.role === USER_ROLES.AGENT) {
      if (requestedAssigneeId && requestedAssigneeId !== currentUser.id) {
        throw new ApiError(403, "Agents can only assign leads to themselves.");
      }

      return currentUser.id;
    }

    if (requestedAssigneeId) {
      const requestedAgent = await userRepository.findActiveAgentById(requestedAssigneeId, options);

      if (!requestedAgent) {
        throw new ApiError(400, "Assigned user must be an active agent.");
      }

      return requestedAgent.id;
    }

    const leastLoadedAgent = await this.getLeastLoadedAgent(options);
    return leastLoadedAgent ? leastLoadedAgent.id : null;
  }
};

module.exports = assignmentService;

