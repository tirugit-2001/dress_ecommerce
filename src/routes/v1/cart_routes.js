const express = require("express");
const { CartController } = require("../../controllers");
const { CartService } = require("../../services");
const { authMiddleware, optionalAuthMiddleware } = require("../../middlewares");

const router = express.Router();
const cartService = new CartService();

const cartController = new CartController({
  cartService,
});

router.use(optionalAuthMiddleware);

router.get("/count", (req, res, next) =>
  cartController.getCartCountById(req, res, next)
);

router.use(authMiddleware);

router.get("/", (req, res, next) => cartController.getCartById(req, res, next));

router.post("/", (req, res, next) => cartController.addItem(req, res, next));

router.patch("/", (req, res, next) => cartController.editItem(req, res, next));

router.delete("/", (req, res, next) =>
  cartController.removeItem(req, res, next)
);

module.exports = router;
