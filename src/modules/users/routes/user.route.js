const express = require("express");
const { registerUser } = require("../controller/user.controller.js");

const router = express.Router();

router.post("/register", registerUser);

module.exports = router;