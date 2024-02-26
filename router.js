const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberController.js");

/**********************************
 *             REST API           *
 **********************************/

// Member related routers

router.post("/signup", memberController.signup);

module.exports = router;
