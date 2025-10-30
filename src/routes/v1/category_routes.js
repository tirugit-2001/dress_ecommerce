const express = require("express");
const {
  CategoryController,
  SubcategoryController,
  ConfigurationController,
  IllustrationController,
  CollectionController,
} = require("../../controllers");
const {
  CategoryService,
  ProductService,
  BannerService,
  ConfigurationService,
  IllustrationService,
  SubCategoryService,
  CollectionService,
} = require("../../services");
const { authMiddleware } = require("../../middlewares");

const router = express.Router();

const categoryService = new CategoryService();
const productService = new ProductService();
const bannerService = new BannerService();
const collectionService = new CollectionService();
const configurationService = new ConfigurationService();
const illustrationService = new IllustrationService();
const subCategoryService = new SubCategoryService();

const categoryController = new CategoryController({
  categoryService,
  bannerService,
  configurationService,
  illustrationService,
  subCategoryService,
  collectionService,
});

const subcategoryController = new SubcategoryController({
  categoryService,
  productService,
  subCategoryService,
});

const configurationController = new ConfigurationController({
  categoryService,
  productService,
  subCategoryService,
  configurationService,
});

const illustrationController = new IllustrationController({
  categoryService,
  illustrationService,
});

const collectionController = new CollectionController({
  categoryService,
  collectionService,
  productService,
});

// ------------------------------ Category Routes ------------------------------

router.get("/list", (req, res, next) =>
  categoryController.getCategoriesList(req, res, next)
);

router.get("/all", (req, res, next) =>
  categoryController.getCategories(req, res, next)
);

router.get("/banners", (req, res, next) =>
  categoryController.getCategoriesBanners(req, res, next)
);

router.get("/details", (req, res, next) =>
  categoryController.getCategoriesDetails(req, res, next)
);

router.use(authMiddleware);

router.post("/", (req, res, next) =>
  categoryController.createCategory(req, res, next)
);

router.patch("/order", (req, res, next) =>
  categoryController.updateCategoryOrder(req, res, next)
);

router.patch("/:categoryId", (req, res, next) =>
  categoryController.updateCategory(req, res, next)
);

router.get("/:categoryId", (req, res, next) =>
  categoryController.getCategoryById(req, res, next)
);

// ------------------------------ Collection Routes ------------------------------

router.get("/:categoryId/collections", (req, res, next) =>
  collectionController.getCollectionsByCategoryId(req, res, next)
);

router.post("/:categoryId/collections", (req, res, next) =>
  collectionController.createCollection(req, res, next)
);

router.get("/:categoryId/collections/:collectionId", (req, res, next) =>
  collectionController.getCollectionById(req, res, next)
);

router.patch("/:categoryId/collections/:collectionId", (req, res, next) =>
  collectionController.updateCollection(req, res, next)
);

router.patch(
  "/:categoryId/collections/:collectionId/products/add",
  (req, res, next) =>
    collectionController.addProductToCollection(req, res, next)
);

router.patch(
  "/:categoryId/collections/:collectionId/products/remove",
  (req, res, next) =>
    collectionController.removeProductFromCollection(req, res, next)
);

// ------------------------------ Subcategory Routes ------------------------------

router.get("/:categoryId/subcategories", (req, res, next) =>
  subcategoryController.getSubCategoriesByCategoryId(req, res, next)
);

router.post("/:categoryId/subcategories", (req, res, next) =>
  subcategoryController.createSubCategory(req, res, next)
);

router.get("/:categoryId/subcategories/:subCategoryId", (req, res, next) =>
  subcategoryController.getSubCategoryById(req, res, next)
);

router.patch("/:categoryId/subcategories/:subCategoryId", (req, res, next) =>
  subcategoryController.updateSubCategory(req, res, next)
);

// ------------------------------ Configuration Routes ------------------------------

router.post("/:categoryId/configurations", (req, res, next) =>
  configurationController.createConfiguration(req, res, next)
);

router.get("/:categoryId/configurations", (req, res, next) =>
  configurationController.getConfigurationsByCategoryId(req, res, next)
);

router.get("/:categoryId/configurations/:configurationId", (req, res, next) =>
  configurationController.getConfigurationById(req, res, next)
);

router.patch("/:categoryId/configurations/:configurationId", (req, res, next) =>
  configurationController.updateConfiguration(req, res, next)
);

router.delete(
  "/:categoryId/configurations/:configurationId/option",
  (req, res, next) =>
    configurationController.deleteConfigurationOption(req, res, next)
);

// ------------------------------ Illustration Routes ------------------------------

router.post("/:categoryId/illustrations", (req, res, next) =>
  illustrationController.addIllustration(req, res, next)
);

router.get("/:categoryId/illustrations", (req, res, next) =>
  illustrationController.getIllustrationsByCategoryId(req, res, next)
);

module.exports = router;
