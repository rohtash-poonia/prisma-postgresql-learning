const express = require("express");
const router = express.Router();
const { prisma } = require("../../config/prisma");
const { body, validationResult } = require("express-validator");

router.post(
  "/orders",
  require("../../middleware/auth"),
  require("../controller/order.controller").createOrder
);
router.get(
  "/orders",
  require("../../middleware/auth"),
  require("../controller/order.controller").getOrders
);

  module.exports = router;