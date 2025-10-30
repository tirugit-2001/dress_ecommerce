class ProductController {
  constructor({ productService, wishlistService, collectionService }) {
    this.productService = productService;
    this.wishlistService = wishlistService;
    this.collectionService = collectionService;
  }

  async createProduct(req, res, next) {
    try {
      const productData = req.body;

      if (!productData) {
        return res.sendError({
          statusCode: 400,
          message: "Product data is required.",
        });
      }

      const newProduct = await this.productService.createProduct(productData);

      res.sendSuccess({
        data: newProduct,
        message: "Product created successfully.",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getProductByIdentifier(req, res, next) {
    try {
      const { identifier } = req.params;
      const userId = req.query.userId;

      if (!identifier) {
        return res.sendError({
          statusCode: 400,
          message: "Product identifier (ID or slug) is required.",
        });
      }

      const product = await this.productService.getProductByIdentifier(
        identifier
      );

      if (!product) {
        return res.sendError({
          statusCode: 404,
          message: "Product not found.",
        });
      }

      let isInWishlist = false;

      if (!userId) {
        isInWishlist = false;
      } else {
        isInWishlist = await this.wishlistService.isProductInWishlist({
          userId,
          productId: product.id,
        });
      }

      product.isInWishlist = isInWishlist;

      res.sendSuccess({
        data: product,
        message: "Product fetched successfully.",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async addWishlistStatus(products, userId) {
    if (!products || products.length === 0) {
      return products;
    }

    if (userId) {
      // Get user's wishlist items
      const wishlistItems = await this.wishlistService.getWishlistByUserId({
        userId,
      });

      // Create a Set of product IDs in wishlist for O(1) lookup
      const wishlistProductIds = new Set(
        wishlistItems.map((item) => item.productId)
      );

      // Mark products that are in wishlist
      products.forEach((product) => {
        product.isInWishlist = wishlistProductIds.has(product.id);
      });
    } else {
      // If no userId, mark all products as not in wishlist
      products.forEach((product) => {
        product.isInWishlist = false;
      });
    }

    return products;
  }

  async getProducts(req, res, next) {
    try {
      const { categoryId, subcategoryId, limit = 20, page = 1 } = req.query;
      const { userId } = req;

      if (!categoryId || !subcategoryId) {
        return res.sendError({
          statusCode: 400,
          message: "Category ID and Sub-Category ID are required.",
        });
      }

      const productsData = await this.productService.getProducts({
        categoryId,
        subcategoryId,
        limit,
        page,
      });

      let products = productsData.products;

      products = await this.addWishlistStatus(products, userId);

      res.sendSuccess({
        data: products,
        meta: productsData.pagination,
        message: "Products fetched successfully.",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getProductsByCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const { limit = 20, page = 1 } = req.query;

      if (!categoryId) {
        return res.sendError({
          statusCode: 400,
          message: "Category ID is required.",
        });
      }

      let productsData = await this.productService.getProducts({
        categoryId,
        limit,
        page,
      });

      const products = productsData.products;

      res.sendSuccess({
        data: products,
        meta: productsData.pagination,
        message: "Products fetched successfully.",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getNewArrivals(req, res, next) {
    try {
      const { categoryId, limit } = req.query;
      const { userId } = req;

      // Validate limit
      const parsedLimit = limit ? parseInt(limit) : 10;
      if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 20) {
        return res.sendError({
          statusCode: 400,
          message: "Limit must be a number between 1 and 20.",
        });
      }

      let products = await this.productService.getNewArrivals({
        categoryId,
        limit: parsedLimit,
      });

      products = await this.addWishlistStatus(products, userId);

      if (!products || products.length === 0) {
        return res.sendError({
          statusCode: 204,
          message: "No new arrivals found.",
        });
      }

      res.sendSuccess({
        data: products,
        message: "New arrivals fetched successfully.",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getBestSellers(req, res, next) {
    try {
      const { categoryId, limit } = req.query;
      const { userId } = req;

      // Validate limit
      const parsedLimit = limit ? parseInt(limit) : 10;
      if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 20) {
        return res.sendError({
          statusCode: 400,
          message: "Limit must be a number between 1 and 20.",
        });
      }

      let products = await this.productService.getBestSellers({
        categoryId,
        limit: parsedLimit,
      });

      products = await this.addWishlistStatus(products, userId);

      if (!products || products.length === 0) {
        return res.sendError({
          statusCode: 204,
          message: "No best sellers found.",
        });
      }

      res.sendSuccess({
        data: products,
        message: "Best sellers fetched successfully.",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getTopChoices(req, res, next) {
    try {
      const { categoryId, limit } = req.query;
      const { userId } = req;

      // Validate limit
      const parsedLimit = limit ? parseInt(limit) : 10;
      if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 20) {
        return res.sendError({
          statusCode: 400,
          message: "Limit must be a number between 1 and 20.",
        });
      }

      let products = await this.productService.getTopChoices({
        categoryId,
        limit: parsedLimit,
      });

      products = await this.addWishlistStatus(products, userId);

      if (!products || products.length === 0) {
        return res.sendError({
          statusCode: 204,
          message: "No top choices found.",
        });
      }

      res.sendSuccess({
        data: products,
        message: "Top choices fetched successfully.",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getFeaturedProducts(req, res, next) {
    try {
      const { categoryId, limit } = req.query;
      const { userId } = req;

      // Validate limit
      const parsedLimit = limit ? parseInt(limit) : 20;
      if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
        return res.sendError({
          statusCode: 400,
          message: "Limit must be a number between 1 and 50.",
        });
      }

      let products = await this.productService.getFeaturedProducts({
        categoryId,
        limit: parsedLimit,
      });

      products = await this.addWishlistStatus(products, userId);

      if (!products || products.length === 0) {
        return res.sendError({
          statusCode: 204,
          message: "No featured products found.",
        });
      }

      res.sendSuccess({
        data: products,
        message: "Featured products fetched successfully.",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getAllProducts(req, res, next) {
    try {
      const products = await this.productService.getAllProducts();

      if (!products || products.length === 0) {
        return res.sendError({
          statusCode: 204,
          message: "No products found",
        });
      }

      res.sendSuccess({
        data: products,
        message: "Products fetched successfully.",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const productId = req.params.productId;
      const updatedData = req.body;

      console.log(productId, updatedData);

      if (!productId || !updatedData) {
        return res.sendError({
          statusCode: 400,
          message: "Product ID and updated data are required.",
        });
      }

      const result = await this.productService.updateProduct({
        productId,
        updatedData,
      });

      res.sendSuccess({
        data: result,
        message: "Product updated successfully.",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getRelatedProducts(req, res, next) {
    try {
      const { identifier } = req.params;
      const { limit } = req.query;

      if (!identifier) {
        return res.sendError({
          statusCode: 400,
          message: "Product identifier (ID or slug) is required.",
        });
      }

      // Validate limit
      const parsedLimit = limit ? parseInt(limit) : 5;
      if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 20) {
        return res.sendError({
          statusCode: 400,
          message: "Limit must be a number between 1 and 20.",
        });
      }

      const products = await this.productService.getRelatedProducts({
        identifier,
        limit: parsedLimit,
      });

      if (!products || products.length === 0) {
        return res.sendError({
          statusCode: 204,
          message: "No related products found.",
        });
      }

      res.sendSuccess({
        data: products,
        message: "Related products fetched successfully.",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async updateProductFeaturedStatus(req, res, next) {
    try {
      const { productId } = req.params;
      const { isNewArrival, isBestSeller, isTopChoice } = req.body;

      if (!productId) {
        return res.sendError({
          statusCode: 400,
          message: "Product ID is required.",
        });
      }

      // Validate that at least one featured flag is provided
      if (
        isNewArrival === undefined &&
        isBestSeller === undefined &&
        isTopChoice === undefined
      ) {
        return res.sendError({
          statusCode: 400,
          message:
            "At least one featured flag (isNewArrival, isBestSeller, isTopChoice) must be provided.",
        });
      }

      const updatedProduct =
        await this.productService.updateProductFeaturedStatus(productId, {
          isNewArrival,
          isBestSeller,
          isTopChoice,
        });

      res.sendSuccess({
        data: updatedProduct,
        message: "Product featured status updated successfully.",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async setNewArrivals(req, res, next) {
    try {
      const { days, limit } = req.body;

      // Validate parameters
      const options = {};
      if (days !== undefined) {
        const parsedDays = parseInt(days);
        if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 90) {
          return res.sendError({
            statusCode: 400,
            message: "Days must be a number between 1 and 90.",
          });
        }
        options.days = parsedDays;
      }

      if (limit !== undefined) {
        const parsedLimit = parseInt(limit);
        if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
          return res.sendError({
            statusCode: 400,
            message: "Limit must be a number between 1 and 100.",
          });
        }
        options.limit = parsedLimit;
      }

      const updatedProducts = await this.productService.setNewArrivals(options);

      if (!updatedProducts || updatedProducts.length === 0) {
        return res.sendError({
          statusCode: 204,
          message: "No products were marked as new arrivals.",
        });
      }

      res.sendSuccess({
        data: { count: updatedProducts.length },
        message: `${updatedProducts.length} products marked as new arrivals.`,
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getProductsByCollection(req, res, next) {
    try {
      const { categoryId, identifier, limit = 20, page = 1 } = req.query;

      if (!categoryId || !identifier) {
        return res.sendError({
          statusCode: 400,
          message: "Category ID and identifier are required.",
        });
      }

      const collection = await this.collectionService.getCollectionByIdentifier(
        {
          identifier,
          categoryId,
        }
      );

      if (!collection) {
        return res.sendError({
          statusCode: 404,
          message: "Collection not found.",
        });
      }

      const productsData = await this.productService.getProducts({
        categoryId,
        collectionId: collection.id,
        limit,
        page,
      });

      const products = productsData.products;

      if (!products || products.length === 0) {
        return res.sendError({
          statusCode: 204,
          message: "No products found in this collection.",
        });
      }

      res.sendSuccess({
        data: products,
        meta: productsData.pagination,
        message: "Products fetched successfully.",
      });
    } catch (error) {
      next(error, res);
    }
  }
}

module.exports = ProductController;
