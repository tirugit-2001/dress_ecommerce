const { firebaseConfig, envConfig } = require("../config");
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = envConfig;
const { firestore, FieldValue } = firebaseConfig;
const { COLLECTIONS, ORDER_STATUS } = require("../constants");
const axios = require("axios");

class OrderService {
  constructor() {
    this.db = firestore;
  }

  async getOrders({ userId, status, skip, limit }) {
    var ordersRef = this.db
      .collection(COLLECTIONS.ORDERS)
      .where("userId", "==", userId);

    if (status) {
      ordersRef = ordersRef.where("status", "==", status);
    }

    ordersRef = ordersRef.orderBy("orderDate", "desc");

    if (skip) {
      ordersRef = ordersRef.startAfter(skip);
    }

    if (limit) {
      ordersRef = ordersRef.limit(limit);
    }

    const orders = await ordersRef.get();
    return orders.docs.map((doc) => doc.data());
  }

  async getOrderByOrderId(orderId) {
    const order = await this.db
      .collection(COLLECTIONS.ORDERS)
      .doc(orderId)
      .get();
    return order.data();
  }

  async getAllOrders({ categoryId, status, skip, limit }) {
    var ordersRef = this.db.collection(COLLECTIONS.ORDERS);

    if (categoryId) {
      ordersRef = ordersRef.where("categories", "array-contains", categoryId);
    }

    if (status) {
      ordersRef = ordersRef.where("status", "==", status);
    }

    ordersRef = ordersRef.orderBy("orderDate", "desc");

    if (skip) {
      ordersRef = ordersRef.startAfter(skip);
    }

    if (limit) {
      ordersRef = ordersRef.limit(limit);
    }

    const orders = await ordersRef.get();
    return orders.docs.map((doc) => doc.data());
  }

  async updateOrder(order) {
    const orderRef = this.db.collection(COLLECTIONS.ORDERS).doc(order.orderId);
    await orderRef.update(order);
  }

  async createOrder(data) {
    try {
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      );

      const { paymentMethod = "ONLINE" } = data;

      let orderStatus = ORDER_STATUS.PAYMENT_PENDING;
      let razorpayData = {};

      // For COD orders, skip Razorpay and mark as confirmed
      if (paymentMethod === "COD") {
        orderStatus = ORDER_STATUS.CONFIRMED;
      } else {
        // Create Razorpay order for online payments
        const razorpayOrder = await this.createRazorpayOrder(data.totalAmount);
        razorpayData = { orderId: razorpayOrder.data.id };
      }

      const orderData = {
        ...cleanData,
        orderDate: FieldValue.serverTimestamp(),
        status: orderStatus,
        paymentMethod,
        ...(Object.keys(razorpayData).length > 0 && { razorpay: razorpayData }),
      };

      const orderRef = this.db.collection(COLLECTIONS.ORDERS).doc();

      const orderWithId = {
        ...orderData,
        orderId: orderRef.id,
      };

      await orderRef.set(orderWithId);

      return orderWithId;
    } catch (error) {
      console.log(error);
      throw new Error(
        `Failed to create order: ${error.message} ${
          error.response?.data || ""
        } ${error}`
      );
    }
  }

  async createRazorpayOrder(totalAmount) {
    const auth = Buffer.from(
      `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`
    ).toString("base64");

    const payload = {
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: Date.now().toString(),
      partial_payment: false,
    };

    const response = await axios.post(
      "https://api.razorpay.com/v1/orders",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (!response.data) {
      throw new Error("Failed to create Razorpay order");
    }

    return response;
  }
}

module.exports = OrderService;
