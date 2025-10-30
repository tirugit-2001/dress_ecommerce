const express = require("express");
const { GiftRewardController } = require("../../controllers"); 
const { GiftRewardService } = require("../../services"); 

const router = express.Router();

const giftRewardService = new GiftRewardService();
const giftRewardController = new GiftRewardController({ giftRewardService }); 



router.post("/", (req, res, next) =>
  giftRewardController.create(req, res, next)
);

router.get("/", (req, res, next) =>
  giftRewardController.getAll(req, res, next)
);

router.get("/:id", (req, res, next) =>
  giftRewardController.getById(req, res, next)
);

router.patch("/:id", (req, res, next) => 
  giftRewardController.update(req, res, next)
);

router.delete("/:id", (req, res, next) =>
  giftRewardController.delete(req, res, next)
);

module.exports = router;