const activityLogService = require("../services/activityLog.service");
const asyncHandler = require("../utils/asyncHandler");
const { buildPaginationMeta, getPagination } = require("../utils/pagination");

const activityLogController = {
  list: asyncHandler(async (req, res) => {
    const { page, limit, offset } = getPagination(req.query);
    const { rows, count } = await activityLogService.list({ limit, offset });

    res.json({
      success: true,
      data: {
        logs: rows,
        pagination: buildPaginationMeta({
          count,
          page,
          limit
        })
      }
    });
  })
};

module.exports = activityLogController;

