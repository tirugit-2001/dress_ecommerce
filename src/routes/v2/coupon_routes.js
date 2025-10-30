const express = require("express");
const { CouponController } = require("../../controllers");
const { CouponService }  = require("../../services");

const router = express.Router();

const couponService = new CouponService();
const couponController = new CouponController({ couponService });

router.post("/", (req, res, next) =>
  couponController.create(req, res, next)
);

router.get("/", (req, res, next) =>
  couponController.getAll(req, res, next)
);

router.get("/:id", (req, res, next) =>
  couponController.getById(req, res, next)
);

router.patch("/:id", (req, res, next) =>
  couponController.update(req, res, next)
);

router.delete("/:id", (req, res, next) =>
  couponController.delete(req, res, next)
);

router.get("/validate/:couponCode", (req, res, next) =>
  couponController.validate(req, res, next)
);

module.exports = router;
