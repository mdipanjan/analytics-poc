const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction/transaction.conntroller");

router.get("/all-transactions", transactionController.getTransaction);

module.exports = router;
