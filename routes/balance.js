const express = require("express");
const router = express.Router();
const authController = require("../controllers/balance/balance.controller");

router.get("/balance", authController.getERC20Balance);

module.exports = router;
