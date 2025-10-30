const express = require("express");
const v1Routes = require("./v1");
const v2Routes = require("./v2");

const router = express.Router();

router.use("/v1", v1Routes);
router.use("/v2", v2Routes);

router.get("/health", (req, res) => {
  res.sendSuccess({ message: "API is Healthy" });
});

router.get("/", (req, res) => {
  res.sendSuccess({ message: "Server is running" });
});
module.exports = router;
