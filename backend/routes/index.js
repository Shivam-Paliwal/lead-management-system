const express = require("express");
const authRoutes = require("./auth.routes");
const leadRoutes = require("./lead.routes");
const activityLogRoutes = require("./activityLog.routes");
const utilRoutes = require("./util.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/leads", leadRoutes);
router.use("/activity-logs", activityLogRoutes);
router.use("/utils", utilRoutes);

module.exports = router;

