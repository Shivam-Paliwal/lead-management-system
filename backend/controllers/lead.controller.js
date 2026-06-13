const leadService = require("../services/lead.service");
const asyncHandler = require("../utils/asyncHandler");

const leadController = {
  create: asyncHandler(async (req, res) => {
    const lead = await leadService.create(req.body, req.user);

    res.status(201).json({
      success: true,
      message: "Lead created successfully.",
      data: {
        lead
      }
    });
  }),

  update: asyncHandler(async (req, res) => {
    const lead = await leadService.update(req.params.id, req.body, req.user);

    res.json({
      success: true,
      message: "Lead updated successfully.",
      data: {
        lead
      }
    });
  }),

  remove: asyncHandler(async (req, res) => {
    await leadService.remove(req.params.id, req.user);

    res.json({
      success: true,
      message: "Lead deleted successfully."
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const lead = await leadService.getById(req.params.id, req.user);

    res.json({
      success: true,
      data: {
        lead
      }
    });
  }),

  list: asyncHandler(async (req, res) => {
    const data = await leadService.list(req.query, req.user);

    res.json({
      success: true,
      data
    });
  }),

  activity: asyncHandler(async (req, res) => {
    const logs = await leadService.listActivity(req.params.id, req.user);

    res.json({
      success: true,
      data: {
        logs
      }
    });
  })
};

module.exports = leadController;

