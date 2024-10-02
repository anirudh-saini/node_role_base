const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");

router.post("/reg", controller.reg);

module.exports = router;
