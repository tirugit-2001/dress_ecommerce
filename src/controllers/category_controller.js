class CategoryController {
  constructor({
    categoryService,
    bannerService,
    subCategoryService,
    configurationService,
    illustrationService,
    collectionService,
  }) {
    this.categoryService = categoryService;
    this.bannerService = bannerService;
    this.subCategoryService = subCategoryService;
    this.configurationService = configurationService;
    this.illustrationService = illustrationService;
    this.collectionService = collectionService;
  }

  async createCategory(req, res, next) {
    try {
      const { name, value, showBooks } = req.body;

      if (!name || !value) {
        return res.sendError({
          statusCode: 400,
          message: "Name and value are required",
        });
      }

      const category = await this.categoryService.createCategory({
        name,
        value,
        showBooks: showBooks ?? false,
      });

      return res.sendSuccess({
        data: category,
        message: "Category created successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const { name, showBooks, isActive } = req.body;

      if (!categoryId) {
        return res.sendError({
          statusCode: 400,
          message: "Category ID is required",
        });
      }

      const category = await this.categoryService.getCategoryById({
        categoryId,
      });

      if (!category) {
        return res.sendError({
          statusCode: 404,
          message: "Category not found",
        });
      }

      const data = {
        name,
        showBooks: showBooks ?? false,
        isActive: isActive ?? true,
      };

      const updatedCategory = await this.categoryService.updateCategory({
        categoryId,
        data,
      });

      return res.sendSuccess({
        data: updatedCategory,
        message: "Category updated successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async updateCategoryOrder(req, res, next) {
    try {
      const { categories } = req.body;

      if (!categories || !Array.isArray(categories)) {
        return res.sendError({
          statusCode: 400,
          message: "Categories array is required",
        });
      }

      const isValid = categories.every(
        (cat) => cat.id && typeof cat.order === "number"
      );
      if (!isValid) {
        return res.sendError({
          statusCode: 400,
          message: "Each category must have an id and order number",
        });
      }

      await this.categoryService.updateCategoryOrder(categories);

      return res.sendSuccess({
        message: "Category order updated successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getCategoriesList(req, res, next) {
    try {
      const categories = await this.categoryService.getCategories();

      if (!categories || categories.length === 0) {
        return res.sendError({
          statusCode: 204,
          message: "No categories found",
        });
      }

      return res.sendSuccess({
        data: category,
        message: "Categories fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getCategories(req, res, next) {
    try {
      const categories = await this.categoryService.getCategories({
        fetchOnlyActive: true,
      });

      if (!categories || categories.length === 0) {
        return res.sendError({
          statusCode: 204,
          message: "No categories found",
        });
      }

      const parsedCategories = await Promise.all(
        categories.map(async (category) => ({
          ...category,
          subCategories:
            await this.subCategoryService.getSubCategoriesByCategoryId(
              category.id
            ),
          collections: await this.collectionService.getCollectionsByCategoryId(
            category.id,
            { fetchActive: true }
          ),
          banners: await this.bannerService.getBannersByCategory(category.id),
        }))
      );

      return res.sendSuccess({
        data: parsedCategories,
        message: "Categories fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getCategoriesBanners(req, res, next) {
    try {
      const categories = await this.categoryService.getCategories();

      if (!categories || categories.length === 0) {
        return res.sendError({
          statusCode: 204,
          message: "No categories found",
        });
      }

      const parsedCategories = await Promise.all(
        categories.map(async (category) => ({
          ...category,
          banners: await this.bannerService.getBannersByCategory(category.id),
        }))
      );

      return res.sendSuccess({
        data: parsedCategories,
        message: "Categories fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getCategoriesDetails(req, res, next) {
    try {
      const categories = await this.categoryService.getCategories();

      if (!categories || categories.length === 0) {
        return res.sendError({
          statusCode: 204,
          message: "No categories found",
        });
      }

      const parsedCategories = await Promise.all(
        categories.map(async (category) => ({
          ...category,
          subCategories:
            await this.subCategoryService.getSubCategoriesByCategoryId(
              category.id
            ),
          configurations:
            await this.configurationService.getConfigurationsByCategoryId(
              category.id
            ),
          collections: await this.collectionService.getCollectionsByCategoryId(
            category.id
          ),
          illustrations:
            await this.illustrationService.getIllustrationsByCategoryId(
              category.id
            ),
        }))
      );

      return res.sendSuccess({
        data: parsedCategories,
        message: "Categories fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getCategoryById(req, res, next) {
    try {
      const { categoryId } = req.params;

      if (!categoryId) {
        return res.sendError({
          statusCode: 400,
          message: "Category ID is required",
        });
      }

      const category = await this.categoryService.getCategoryById({
        categoryId,
      });

      if (!category) {
        return res.sendError({
          statusCode: 404,
          message: "Category not found",
        });
      }

      const parsedCategory = {
        ...category,
        subCategories: this.subCategoryService.getSubCategoriesByCategoryId(
          category.id
        ),
      };

      return res.sendSuccess({
        data: parsedCategory,
        message: "Category fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }
}

module.exports = CategoryController;
