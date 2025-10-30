class SubcategoryController {
  constructor({ categoryService, productService, subCategoryService }) {
    this.categoryService = categoryService;
    this.productService = productService;
    this.subCategoryService = subCategoryService;
  }

  async createSubCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const { name, fields, value, isBook = false } = req.body;

      if (!categoryId || !name || !fields) {
        let missingFields = [];
        if (!categoryId) {
          missingFields.push("Category ID");
        }
        if (!name) {
          missingFields.push("Sub-category name");
        }
        if (!fields) {
          missingFields.push("Sub-category fields");
        }
        if (!value) {
          missingFields.push("Sub-category value");
        }

        return res.sendError({
          statusCode: 400,
          message: `Missing fields: ${missingFields.join(", ")}`,
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
        fields,
        value,
        isBook,
      };

      const subCategory = await this.subCategoryService.createSubCategory({
        categoryId,
        data,
      });

      return res.sendSuccess({
        data: subCategory,
        message: "Sub-category created successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getSubCategoriesByCategoryId(req, res, next) {
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

      const subCategories =
        await this.subCategoryService.getSubCategoriesByCategoryId(categoryId);

      if (!subCategories || subCategories.length === 0) {
        return res.sendError({
          statusCode: 204,
          message: "No sub-categories found for the given category",
        });
      }

      return res.sendSuccess({
        data: subCategories,
        message: "Sub-categories fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getSubCategoryById(req, res, next) {
    try {
      const { categoryId, subCategoryId } = req.params;

      if (!categoryId || !subCategoryId) {
        let missingFields = [];
        if (!categoryId) {
          missingFields.push("Category ID");
        }
        if (!subCategoryId) {
          missingFields.push("Sub-category ID");
        }

        return res.sendError({
          statusCode: 400,
          message: `Missing fields: ${missingFields.join(", ")}`,
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

      const subCategory = await this.subCategoryService.getSubCategoryById({
        categoryId,
        subCategoryId,
      });

      if (!subCategory) {
        return res.sendError({
          statusCode: 404,
          message: "Sub-category not found",
        });
      }

      return res.sendSuccess({
        data: subCategory,
        message: "Sub-category fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async updateSubCategory(req, res, next) {
    try {
      const { categoryId, subCategoryId } = req.params;

      const { name, fields, isBook, image } = req.body;

      if (!categoryId || !subCategoryId || !name || !fields) {
        let missingFields = [];
        if (!categoryId) {
          missingFields.push("Category ID");
        }
        if (!subCategoryId) {
          missingFields.push("Sub-category ID");
        }
        if (!name) {
          missingFields.push("Sub-category name");
        }
        if (!fields) {
          missingFields.push("Sub-category fields");
        }

        return res.sendError({
          statusCode: 400,
          message: `Missing fields: ${missingFields.join(", ")}`,
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

      const subCategory = await this.subCategoryService.getSubCategoryById({
        categoryId,
        subCategoryId,
      });

      if (!subCategory) {
        return res.sendError({
          statusCode: 404,
          message: "Sub-category not found",
        });
      }

      const missingFields = subCategory.fields.filter(
        (field) => !fields.includes(field)
      );

      if (missingFields.length !== 0) {
        const productsWithMissingFields = (
          await Promise.all(
            missingFields.map(
              async (field) =>
                await this.productService.getProductsByField({
                  categoryId,
                  subcategoryId: subCategory.id,
                  value: field,
                })
            )
          )
        ).flat();

        if (productsWithMissingFields.length !== 0) {
          return res.sendError({
            statusCode: 400,
            message: `${productsWithMissingFields.join(
              ", "
            )} is used in products`,
          });
        }
      }

      const data = {
        name,
        fields,
        isBook,
        image,
      };

      const updatedSubCategory =
        await this.subCategoryService.updateSubCategory({
          categoryId,
          subCategoryId,
          data,
        });

      return res.sendSuccess({
        data: updatedSubCategory,
        message: "Sub-category updated successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }
}

module.exports = SubcategoryController;
