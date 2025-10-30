const { envConfig } = require("../config");
const { SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD } = envConfig;
const axios = require("axios");

class ShipmentService {
  constructor() {
    this.authToken = null;
    this.tokenExpiry = null;
    // Adding a buffer time (1 hour) before actual expiry to refresh the token
    this.tokenBufferTime = 60 * 60 * 1000; // 1 hour in milliseconds
  }

  async getAuthToken() {
    // Check if we have a valid token that's not about to expire
    const now = Date.now();
    if (
      this.authToken &&
      this.tokenExpiry &&
      now < this.tokenExpiry - this.tokenBufferTime
    ) {
      return this.authToken;
    }

    try {
      const response = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/auth/login",
        {
          email: SHIPROCKET_EMAIL,
          password: SHIPROCKET_PASSWORD,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      this.authToken = response.data.token;
      // Set token expiry to 10 days (240 hours) from now
      this.tokenExpiry = now + 240 * 60 * 60 * 1000;

      return this.authToken;
    } catch (error) {
      console.error(
        "Error fetching token:",
        error.response ? error.response.data : error.message
      );
      return null;
    }
  }

  async makeAuthenticatedRequest(method, url, data = null) {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error("Failed to retrieve authentication token.");
      }

      const config = {
        method,
        url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      if (
        data &&
        (method.toLowerCase() === "post" || method.toLowerCase() === "put")
      ) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      // If we get a 401 Unauthorized error, our token might be expired
      // Force token refresh and try again
      if (error.response && error.response.status === 401) {
        // Force token refresh
        this.authToken = null;
        this.tokenExpiry = null;

        // Try the request again with a new token
        const token = await this.getAuthToken();
        if (!token) {
          throw new Error(
            "Failed to retrieve authentication token after refresh attempt."
          );
        }

        const config = {
          method,
          url,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        if (
          data &&
          (method.toLowerCase() === "post" || method.toLowerCase() === "put")
        ) {
          config.data = data;
        }

        const response = await axios(config);
        return response.data;
      }

      // For other errors, just throw them
      throw error;
    }
  }

  orderData(order) {
    return {
      order_id: order.orderId || "ORD-" + Date.now(),
      order_date:
        order.orderDate ||
        new Date().toISOString().slice(0, 19).replace("T", " "),
      pickup_location: "PrintEasy",
      channel_id: "",
      comment: "",
      billing_customer_name: order.billingAddress?.name || "",
      billing_last_name: order.billingAddress?.lastName || "",
      billing_address: order.billingAddress?.line1 || "",
      billing_address_2: order.billingAddress?.line2 || "",
      billing_city: order.billingAddress?.city || "",
      billing_pincode: order.billingAddress?.pinCode || "",
      billing_state: order.billingAddress?.state || "",
      billing_country: order.billingAddress?.country || "India",
      billing_email: order.billingAddress?.email || "",
      billing_phone: order.billingAddress?.mobile || "",
      shipping_is_billing: order.billingAddressId === order.shippingAddressId,
      shipping_customer_name: order.shippingAddress?.name || "",
      shipping_last_name: order.shippingAddress?.lastName || "",
      shipping_address: order.shippingAddress?.line1 || "",
      shipping_address_2: order.shippingAddress?.line2 || "",
      shipping_city: order.shippingAddress?.city || "",
      shipping_pincode: order.shippingAddress?.pinCode || "",
      shipping_country: order.shippingAddress?.country || "India",
      shipping_state: order.shippingAddress?.state || "",
      shipping_email: order.shippingAddress?.email || "",
      shipping_phone: order.shippingAddress?.mobile || "",
      order_items: order.items.map((e) => ({
        name: e.name,
        sku: e.sku,
        units: e.quantity,
        selling_price: e.totalPrice,
        discount: e.discount || 0,
        tax: e.tax || 12,
        hsn: e.hsn || 482090,
      })),

      payment_method: order.paymentMethod || "Prepaid",
      shipping_charges: order.shippingCharges || 0,
      giftwrap_charges: order.giftwrapCharges || 0,
      transaction_charges: order.transactionCharges || 0,
      total_discount: order.totalDiscount || 0,
      sub_total: order.totalAmount || 0, //ttl amt

      // Package Details
      length: order.items.reduce(
        (acc, curr) => acc + curr.dimensions.length,
        0
      ),
      breadth: order.items.reduce(
        (acc, curr) => acc + curr.dimensions.width,
        0
      ),
      height: order.items.reduce(
        (acc, curr) => acc + curr.dimensions.height,
        0
      ),
      weight: order.items.reduce(
        (acc, curr) => acc + curr.dimensions.weight,
        0
      ),
    };
  }

  async createShipment(order) {
    const data = this.orderData(order);
    return this.makeAuthenticatedRequest(
      "post",
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      data
    );
  }

  async getTracking(orderId) {
    return this.makeAuthenticatedRequest(
      "get",
      `https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${orderId}`
    );
  }
}

module.exports = ShipmentService;
