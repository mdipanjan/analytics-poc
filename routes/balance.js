const express = require("express");
const router = express.Router();
const balanceController = require("../controllers/balance/balance.controller");

router.get("/balance", balanceController.getERC20Balance);

module.exports = router;
