const express = require("express");
const { ProductController } = require("../../controllers");
const {
  ProductService,
  WishlistService,
  CollectionService,
} = require("../../services");
const { authMiddleware, optionalAuthMiddleware } = require("../../middlewares");
const router = express.Router();
const productService = new ProductService();
const wishlistService = new WishlistService();
const collectionService = new CollectionService();

const productController = new ProductController({
  productService,
  wishlistService,
  collectionService,
});

router.use(optionalAuthMiddleware);

router.get("/", (req, res, next) =>
  productController.getProducts(req, res, next)
);

router.get("/category/:categoryId", (req, res, next) =>
  productController.getProductsByCategory(req, res, next)
);

// New featured product routes
router.get("/featured/new-arrivals", (req, res, next) =>
  productController.getNewArrivals(req, res, next)
);

router.get("/featured/best-sellers", (req, res, next) =>
  productController.getBestSellers(req, res, next)
);

router.get("/featured/top-choices", (req, res, next) =>
  productController.getTopChoices(req, res, next)
);

router.get("/featured/all", (req, res, next) =>
  productController.getFeaturedProducts(req, res, next)
);

router.get("/collections", (req, res, next) =>
  productController.getProductsByCollection(req, res, next)
);

// Admin routes for managing featured products
router.patch("/featured/:productId", authMiddleware, (req, res, next) =>
  productController.updateProductFeaturedStatus(req, res, next)
);

router.post("/featured/set-new-arrivals", authMiddleware, (req, res, next) =>
  productController.setNewArrivals(req, res, next)
);

router.get("/:identifier/related", (req, res, next) =>
  productController.getRelatedProducts(req, res, next)
);

router.get("/all", authMiddleware, (req, res, next) =>
  productController.getAllProducts(req, res, next)
);

// Keep this route at the bottom to avoid conflicts with other routes
router.get("/:identifier", (req, res, next) =>
  productController.getProductByIdentifier(req, res, next)
);

router.use(authMiddleware);

router.post("/", (req, res, next) =>
  productController.createProduct(req, res, next)
);

router.patch("/:productId", (req, res, next) =>
  productController.updateProduct(req, res, next)
);

module.exports = router;
