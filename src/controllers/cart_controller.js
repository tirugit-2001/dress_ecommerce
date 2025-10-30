class CartController {
  constructor({ cartService }) {
    this.cartService = cartService;
  }

  async getCartById(req, res, next) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.sendError({
          statusCode: 400,
          message: "User ID is required",
        });
      }

      const cart = await this.cartService.getCartByUserId({ userId });

      if (!cart) {
        return res.sendError({
          statusCode: 404,
          message: "Cart not found",
        });
      }

      res.sendSuccess({
        data: cart,
        message: "Cart fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getCartCountById(req, res, next) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.sendSuccess({
          statusCode: 200,
          data: { count: 0 },
          message: "No items in cart",
        });
      }

      const count = await this.cartService.getCartCountById({ userId });

      res.sendSuccess({
        data: { count },
        message: count <= 0 ? "No items in cart" : "Cart fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async addItem(req, res, next) {
    try {
      const userId = req.userId;
      const itemData = req.body;

      if (!userId || !itemData) {
        return res.sendError({
          statusCode: 400,
          message: "User ID and item data are required",
        });
      }

      const newItem = await this.cartService.addItem(userId, itemData);

      return res.sendSuccess({
        data: newItem,
        message: "Item added to cart successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async editItem(req, res, next) {
    try {
      const itemId = req.query.itemId;
      const userId = req.userId;
      const { quantity } = req.body;

      if (!userId || !itemId || !quantity) {
        return res.sendError({
          statusCode: 400,
          message: "User ID, item ID, and new quantity are required",
        });
      }

      const result = await this.cartService.editItem({
        userId,
        itemId,
        newQuantity: quantity,
      });

      res.sendSuccess({
        data: result,
        message: "Item quantity updated successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async removeItem(req, res, next) {
    try {
      const itemId = req.query.itemId;
      const userId = req.userId;

      if (!userId || !itemId) {
        return res.sendError({
          statusCode: 400,
          message: "User ID and item ID are required",
        });
      }

      const result = await this.cartService.removeItem({ userId, itemId });

      res.sendSuccess({
        data: result,
        message: "Item removed from cart successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }
}

module.exports = CartController;
