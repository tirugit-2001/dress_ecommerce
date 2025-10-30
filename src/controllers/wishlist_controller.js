class WishlistController {
  constructor({ wishlistService, productService }) {
    this.wishlistService = wishlistService;
    this.productService = productService;
  }

  async getWishlist(req, res, next) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.sendError({
          statusCode: 400,
          message: "User ID is required",
        });
      }

      const wishlist = await this.wishlistService.getWishlistByUserId({
        userId,
      });

      const parsedWishlist = (
        await Promise.all(
          wishlist.map(async (item) => {
            const product = await this.productService.getProductByIdentifier(
              item.productId
            );
            return product;
          })
        )
      ).filter((product) => product !== null);

      res.sendSuccess({
        data: parsedWishlist,
        message: "Wishlist fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async addToWishlist(req, res, next) {
    try {
      const userId = req.userId;
      const { productId } = req.body;

      if (!userId || !productId) {
        return res.sendError({
          statusCode: 400,
          message: "User ID and product ID are required",
        });
      }

      const product = await this.productService.getProductByIdentifier(
        productId
      );

      if (!product) {
        return res.sendError({
          statusCode: 404,
          message: "Product not found",
        });
      }

      const result = await this.wishlistService.addToWishlist({
        userId,
        productId,
      });

      res.sendSuccess({
        data: result,
        message: "Product added to wishlist successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async removeFromWishlist(req, res, next) {
    try {
      const userId = req.userId;
      const { productId } = req.params;

      if (!userId || !productId) {
        return res.sendError({
          statusCode: 400,
          message: "User ID and product ID are required",
        });
      }

      const product = await this.productService.getProductByIdentifier(
        productId
      );

      if (!product) {
        return res.sendError({
          statusCode: 404,
          message: "Product not found",
        });
      }

      const result = await this.wishlistService.removeFromWishlist({
        userId,
        productId,
      });

      res.sendSuccess({
        data: result,
        message: "Product removed from wishlist successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async checkWishlistStatus(req, res, next) {
    try {
      const userId = req.userId;
      const { productId } = req.params;

      if (!userId || !productId) {
        return res.sendError({
          statusCode: 400,
          message: "User ID and product ID are required",
        });
      }

      const isInWishlist = await this.wishlistService.isProductInWishlist({
        userId,
        productId,
      });

      res.sendSuccess({
        data: { isInWishlist },
        message: "Wishlist status checked successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }
}

module.exports = WishlistController;
