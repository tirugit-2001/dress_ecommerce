class OrderController {
  constructor({
    orderService,
    addressService,
    userService,
    cartService,
    franchiseService,
    shipmentService,
    couponService,
  }) {
    this.orderService = orderService;
    this.addressService = addressService;
    this.userService = userService;
    this.cartService = cartService;
    this.franchiseService = franchiseService;
    this.shipmentService = shipmentService;
    this.couponService = couponService;
  }

  async parseOrder(order) {
    const { orderDate } = order;

    return {
      ...order,
      orderDate:
        orderDate && orderDate.toDate
          ? orderDate.toDate()
          : new Date(Date.now()).toISOString(),
    };
  }

  async getAllOrders(req, res, next) {
    try {
      const {
        categoryId,
        status,
        // skip = 0,
        // limit = 20,
      } = req.query;
      const orders = await this.orderService.getAllOrders({
        categoryId,
        status,
        // skip,
        // limit,
      });
      const parseOrders = await Promise.all(
        orders.map((order) => this.parseOrder(order))
      );
      res.sendSuccess({
        data: parseOrders,
        meta: {
          total: orders.length,
        },
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getOrders(req, res, next) {
    try {
      const userId = req.userId;
      const { status } = req.query;
      // const { status, skip = 0, limit = 10 } = req.query;
      if (!userId) {
        return res.sendError({
          statusCode: 400,
          message: "User ID is required",
        });
      }
      const orders = await this.orderService.getOrders({
        userId,
        status,
        // skip,
        // limit,
      });

      const parseOrders = await Promise.all(
        orders.map((order) => this.parseOrder(order))
      );

      res.sendSuccess({ data: parseOrders });
    } catch (error) {
      next(error, res);
    }
  }

  async createOrder(req, res, next) {
    try {
      const {
        shippingAddressId,
        billingAddressId,
        cartIds,
        couponCode,
        paymentMethod = "ONLINE",
      } = req.body;
      const userId = req.userId;

      if (!userId) {
        return res.sendError({ message: "User ID is required" });
      }
      if (!cartIds || cartIds.length === 0) {
        return res.sendError({ message: "Cart IDs are required" });
      }

      // Validate payment method
      if (!["COD", "ONLINE"].includes(paymentMethod)) {
        return res.sendError({
          message: "Invalid payment method. Allowed values: COD, ONLINE",
        });
      }

      let franchiseId;
      let discount;
      let isWebsiteCouponUsed = false;
      let websiteCouponId = null;

      if (couponCode) {
        const couponResult = await this.couponService.findCouponOrFranchise(
          couponCode
        );

        if (!couponResult || couponResult.error) {
          return res.sendError({
            message: couponResult?.reason || "Invalid or expired coupon code",
          });
        }

        discount = couponResult.discount;
        if (couponResult.source === "franchise") {
          franchiseId = couponResult.franchise.id;
        } else if (couponResult.source === "coupon") {
          isWebsiteCouponUsed = true;
          websiteCouponId = couponResult.coupon.id;
        }
      }

      // Fetch necessary data concurrently
      const [items, shippingAddress, billingAddress, user] = await Promise.all([
        Promise.all(
          cartIds.map((cartId) =>
            this.cartService.getCartById({ userId, cartId })
          )
        ),
        this.addressService.getAddressById({
          userId,
          addressId: shippingAddressId,
        }),
        shippingAddressId !== billingAddressId
          ? this.addressService.getAddressById({
              userId,
              addressId: billingAddressId,
            })
          : null,
        this.userService.getUserById(userId),
      ]);

      // Check if COD is allowed (COD not allowed if any item is customizable)
      if (paymentMethod === "COD") {
        const hasCustomizableItems = items.some((item) => item.isCustomizable);
        if (hasCustomizableItems) {
          return res.sendError({
            message:
              "COD not allowed for orders containing customizable items. Please use online payment or remove customizable items from cart.",
          });
        }
      }

      var totalAmount = items.reduce(
        (acc, item) => acc + item.totalPrice * item.quantity,
        0
      );

      if (discount) {
        totalAmount = Number((totalAmount * (1 - discount / 100)).toFixed(2));
      }

      if (totalAmount < 500) {
        totalAmount = Number((totalAmount + 50).toFixed(2));
      }

      const categories = items.map((item) => item.categoryId);

      const orderData = await this.orderService.createOrder({
        userId,
        user,
        items,
        totalAmount,
        franchiseId,
        couponCode,
        categories,
        shippingAddressId,
        shippingAddress,
        billingAddressId,
        billingAddress: billingAddress || shippingAddress,
        paymentMethod,
      });

      Promise.all(
        cartIds.map((cartId) =>
          this.cartService.removeItem({ userId, itemId: cartId })
        )
      );

      // if website coupon has been used then to increment the usedcount for this coupan with id couponId
      if (isWebsiteCouponUsed && websiteCouponId) {
        await this.couponService.incrementUsedCount(websiteCouponId);
      }

      res.sendSuccess({
        data: await this.parseOrder(orderData),
        message: "Order created successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getTracking(req, res, next) {
    try {
      const { orderId } = req.params;
      if (!orderId) {
        return res.sendError({ message: "Order ID is required" });
      }
      const tracking = await this.shipmentService.getTracking(orderId);
      res.sendSuccess({ data: { tracking } });
    } catch (error) {
      next(error, res);
    }
  }
}

module.exports = OrderController;
