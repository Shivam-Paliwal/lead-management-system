const randomLeadService = require("../services/randomLead.service");
const asyncHandler = require("../utils/asyncHandler");

const utilController = {
  randomLead: asyncHandler(async (_req, res) => {
    const lead = await randomLeadService.getRandomLead();

    res.json({
      success: true,
      data: {
        lead
      }
    });
  })
};

module.exports = utilController;

