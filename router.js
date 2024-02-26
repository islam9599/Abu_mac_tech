const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberController.js");

/**********************************
 *             REST API           *
 **********************************/

// Member related routers

router.post("/signup", memberController.signup);
router.post("/login", memberController.login);

module.exports = router;
