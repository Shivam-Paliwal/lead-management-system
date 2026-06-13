const express = require("express");
const utilController = require("../controllers/util.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/random-lead", authenticate, utilController.randomLead);

module.exports = router;

