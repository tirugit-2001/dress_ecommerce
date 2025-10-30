const express = require("express");
const { BannerController } = require("../../controllers");
const { BannerService } = require("../../services");

const router = express.Router();
const bannerService = new BannerService();

const bannerController = new BannerController({
  bannerService,
});

router.post("/", (req, res, next) =>
  bannerController.createBanner(req, res, next)
);

router.get("/:categoryId", (req, res, next) =>
  bannerController.getBannersByCategory(req, res, next)
);

router.patch("/:categoryId", (req, res, next) =>
  bannerController.updateBannerOrders(req, res, next)
);

router.patch("/:categoryId/:bannerId", (req, res, next) =>
  bannerController.updateBanner(req, res, next)
);

module.exports = router;
