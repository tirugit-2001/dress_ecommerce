class CollectionController {
  constructor({ collectionService, categoryService, productService }) {
    this.collectionService = collectionService;
    this.categoryService = categoryService;
    this.productService = productService;
  }

  async createCollection(req, res, next) {
    try {
      const { categoryId } = req.params;
      const { name, description, image, slug, section = 1 } = req.body;

      if (!categoryId || !name || !description || !image || !slug) {
        let missingFields = [];
        if (!categoryId) {
          missingFields.push("Category ID");
        }
        if (!name) {
          missingFields.push("Name");
        }
        if (!description) {
          missingFields.push("Description");
        }
        if (!image) {
          missingFields.push("Image");
        }
        if (!slug) {
          missingFields.push("Slug");
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
        description,
        image,
        slug,
        isActive: true,
        section,
        categoryId,
      };

      const collection = await this.collectionService.createCollection({
        categoryId,
        data,
      });

      return res.sendSuccess({
        data: collection,
        message: "Collection created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getCollectionsByCategoryId(req, res, next) {
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

      const collections =
        await this.collectionService.getCollectionsByCategoryId(categoryId);

      if (!collections || collections.length === 0) {
        return res.sendError({
          statusCode: 204,
          message: "No collections found for the given category",
        });
      }

      return res.sendSuccess({
        data: collections,
        message: "Collections fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getCollectionById(req, res, next) {
    try {
      const { categoryId, collectionId } = req.params;

      if (!categoryId || !collectionId) {
        let missingFields = [];
        if (!categoryId) {
          missingFields.push("Category ID");
        }
        if (!collectionId) {
          missingFields.push("Collection ID");
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

      const collection = await this.collectionService.getCollectionByIdentifier(
        {
          categoryId,
          identifier: collectionId,
        }
      );

      if (!collection) {
        return res.sendError({
          statusCode: 404,
          message: "Collection not found",
        });
      }

      return res.sendSuccess({
        data: collection,
        message: "Collection fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async updateCollection(req, res, next) {
    try {
      const { categoryId, collectionId } = req.params;
      const { name, description, image, isActive } = req.body;

      if (!categoryId || !collectionId) {
        let missingFields = [];
        if (!categoryId) {
          missingFields.push("Category ID");
        }
        if (!collectionId) {
          missingFields.push("Collection ID");
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

      const collection = await this.collectionService.getCollectionByIdentifier(
        {
          categoryId,
          identifier: collectionId,
        }
      );

      if (!collection) {
        return res.sendError({
          statusCode: 404,
          message: "Collection not found",
        });
      }

      const data = {
        name,
        description,
        image,
        isActive,
      };

      const updatedCollection = await this.collectionService.updateCollection({
        categoryId,
        collectionId,
        data,
      });

      return res.sendSuccess({
        data: updatedCollection,
        message: "Collection updated successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async addProductToCollection(req, res, next) {
    try {
      const { categoryId, collectionId } = req.params;
      const { productIds } = req.body;

      if (!categoryId || !collectionId || !productIds) {
        let missingFields = [];
        if (!categoryId) {
          missingFields.push("Category ID");
        }
        if (!collectionId) {
          missingFields.push("Collection ID");
        }
        if (!productIds || productIds.length === 0) {
          missingFields.push("Product IDs");
        }

        return res.sendError({
          statusCode: 400,
          message: `Missing fields: ${missingFields.join(", ")}`,
        });
      }

      const collection = await this.collectionService.getCollectionByIdentifier(
        {
          categoryId,
          identifier: collectionId,
        }
      );

      if (!collection) {
        return res.sendError({
          statusCode: 404,
          message: "Collection not found",
        });
      }

      // Check if all products exist and are active
      const products = await Promise.all(
        productIds.map((productId) =>
          this.productService.getProductByIdentifier(productId)
        )
      );

      const validProducts = products.filter(
        (product) => product !== null && product !== undefined
      );

      if (validProducts.length !== productIds.length) {
        return res.sendError({
          statusCode: 404,
          message: "One or more products not found or inactive",
        });
      }

      const updatedCollection =
        await this.collectionService.addProductsToCollection({
          categoryId,
          collectionId,
          productIds: validProducts.map((product) => product.id),
        });

      return res.sendSuccess({
        data: updatedCollection,
        message: `${validProducts.length} Product(s) added to collection successfully`,
      });
    } catch (error) {
      next(error, res);
    }
  }

  async removeProductFromCollection(req, res, next) {
    try {
      const { categoryId, collectionId } = req.params;
      const { productIds } = req.body;

      if (!categoryId || !collectionId || !productIds) {
        let missingFields = [];
        if (!categoryId) {
          missingFields.push("Category ID");
        }
        if (!collectionId) {
          missingFields.push("Collection ID");
        }
        if (!productIds || productIds.length === 0) {
          missingFields.push("Product IDs");
        }

        return res.sendError({
          statusCode: 400,
          message: `Missing fields: ${missingFields.join(", ")}`,
        });
      }

      const collection = await this.collectionService.getCollectionByIdentifier(
        {
          categoryId,
          identifier: collectionId,
        }
      );

      if (!collection) {
        return res.sendError({
          statusCode: 404,
          message: "Collection not found",
        });
      }

      // Check if all products exist and are active
      const products = await Promise.all(
        productIds.map((productId) =>
          this.productService.getProductByIdentifier(productId)
        )
      );

      const validProducts = products.filter(
        (product) => product !== null && product !== undefined
      );

      if (validProducts.length !== productIds.length) {
        return res.sendError({
          statusCode: 404,
          message: "One or more products not found or inactive",
        });
      }

      const updatedCollection =
        await this.collectionService.removeProductsFromCollection({
          categoryId,
          collectionId,
          productIds: validProducts.map((product) => product.id),
        });

      return res.sendSuccess({
        data: updatedCollection,
        message: `${validProducts.length} Product(s) removed from collection successfully`,
      });
    } catch (error) {
      next(error, res);
    }
  }
}

module.exports = CollectionController;
