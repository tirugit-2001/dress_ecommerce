const { ORDER_STATUS } = require("../constants");

class PaymentController {
  constructor({
    paymentService,
    orderService,
    transactionService,
    franchiseService,
    shipmentService,
    addressService,
    whatsappService,
  }) {
    this.paymentService = paymentService;
    this.orderService = orderService;
    this.transactionService = transactionService;
    this.franchiseService = franchiseService;
    this.shipmentService = shipmentService;
    this.addressService = addressService;
    this.whatsappService = whatsappService;
  }

  async parseOrder(order) {
    const {
      userId,
      shippingAddress,
      shippingAddressId,
      billingAddress,
      billingAddressId,
      orderDate,
    } = order;

    const addressPromises =
      shippingAddressId === billingAddressId
        ? [
            shippingAddress
              ? shippingAddress
              : this.addressService.getAddressById({
                  userId,
                  addressId: shippingAddressId,
                }),
          ]
        : [
            shippingAddress
              ? shippingAddress
              : this.addressService.getAddressById({
                  userId,
                  addressId: shippingAddressId,
                }),
            billingAddress
              ? billingAddress
              : this.addressService.getAddressById({
                  userId,
                  addressId: billingAddressId,
                }),
          ];

    const addresses = await Promise.all(addressPromises);

    const shipAddress = addresses[0];
    const billAddress =
      shippingAddressId === billingAddressId ? shipAddress : addresses[1];

    return {
      ...order,
      shipAddress,
      billAddress,
      orderDate:
        orderDate && orderDate.toDate
          ? orderDate.toDate()
          : new Date(Date.now()).toISOString(),
    };
  }

  async verifyPayment(req, res, next) {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      req.body;

    if (
      !orderId ||
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return res.sendError({
        message: "Missing required parameters",
      });
    }

    try {
      const order = await this.orderService.getOrderByOrderId(orderId);

      if (!order) {
        return res.sendError({
          message: "Order not found",
        });
      }

      // Handle COD orders differently
      if (order.paymentMethod === "COD") {
        // For COD orders, skip payment verification but still process fulfillment
        console.log(
          "Processing COD order fulfillment without payment verification"
        );
      } else {
        // For online payments, verify Razorpay signature
        const isVerified = await this.paymentService.verifyPayment({
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        });

        if (!isVerified) {
          return res.sendError({
            message: "Payment verification failed",
          });
        }
      }

      const { franchiseId } = order;

      if (franchiseId) {
        this.franchiseService
          .getFranchiseById(franchiseId)
          .then((franchise) => {
            const { totalAmount, orderId } = order;
            this.transactionService.createTransaction(franchiseId, {
              franchiseId,
              userId: order.userId,
              orderId,
              coupon: order.couponCode,
              orderAmount: totalAmount,
              amount: totalAmount * (franchise.commission / 100),
            });
            this.franchiseService.updateFranchise(franchiseId, {
              unsettledAmount:
                franchise.unsettledAmount +
                order.totalAmount * (franchise.commission / 100),
            });
          });
      }

      const parsedOrder = await this.parseOrder(order);

      // For COD orders, add empty razorpay data to maintain consistency
      if (order.paymentMethod === "COD") {
        parsedOrder.razorpay = {
          orderId: "COD_ORDER",
          paymentId: "COD_PAYMENT",
          signature: "COD_SIGNATURE",
        };
      } else {
        // For online payments, add actual Razorpay data
        parsedOrder.razorpay = {
          orderId: razorpayOrderId,
          paymentId: razorpayPaymentId,
          signature: razorpaySignature,
        };
      }

      parsedOrder.status = ORDER_STATUS.CONFIRMED;

      const data = await this.shipmentService.createShipment(parsedOrder);

      const shiprocket = {
        shipmentId: String(data.shipment_id),
        orderId: String(data.order_id),
        orderNumber: data.channel_order_id,
      };

      parsedOrder.shiprocket = shiprocket;

      await this.orderService.updateOrder(parsedOrder);

      const { phone } = order.user;

      this.whatsappService.sendMessage(phone);

      res.sendSuccess({
        message:
          order.paymentMethod === "COD"
            ? "COD order fulfilled successfully"
            : "Order placed successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }
}

module.exports = PaymentController;
