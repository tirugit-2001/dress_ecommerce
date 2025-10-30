const express = require("express");
const { PromoHeadlineController } = require("../../controllers"); 
const { PromoHeadlineService } = require("../../services"); 
const { authMiddleware } = require("../../middlewares")
const router = express.Router();

const promoHeadlineService = new PromoHeadlineService();

const promoHeadlineController = new PromoHeadlineController({ promoHeadlineService }); 


router.get("/active", (req, res, next) =>
  promoHeadlineController.getActiveHeadlines(req, res, next) 
);

 router.use(authMiddleware);

router.post("/", (req, res, next) =>
  promoHeadlineController.createHeadline(req, res, next) 
);

router.get("/", (req, res, next) =>
  promoHeadlineController.getAllHeadlines(req, res, next)
);

router.get("/:id", (req, res, next) =>
  promoHeadlineController.getHeadlineById(req, res, next) 
);

router.patch("/:id", (req, res, next) => 
  promoHeadlineController.updateHeadline(req, res, next) 
);

router.delete("/:id", (req, res, next) =>
  promoHeadlineController.deleteHeadline(req, res, next) 
);



module.exports = router;