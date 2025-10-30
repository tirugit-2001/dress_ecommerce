const express = require("express");
const { WishlistController } = require("../../controllers");
const { WishlistService, ProductService } = require("../../services");

const router = express.Router();
const wishlistService = new WishlistService();
const productService = new ProductService();

const wishlistController = new WishlistController({
  wishlistService,
  productService,
});

router.get("/", (req, res, next) =>
  wishlistController.getWishlist(req, res, next)
);

router.post("/", (req, res, next) =>
  wishlistController.addToWishlist(req, res, next)
);

router.delete("/:productId", (req, res, next) =>
  wishlistController.removeFromWishlist(req, res, next)
);

router.get("/:productId/status", (req, res, next) =>
  wishlistController.checkWishlistStatus(req, res, next)
);

module.exports = router;
