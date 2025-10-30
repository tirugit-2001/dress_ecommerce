const { firebaseConfig, envConfig } = require("../config");
const { firestore } = firebaseConfig;
const { RAZORPAY_KEY_SECRET } = envConfig;
const crypto = require("crypto");

class PaymentService {
  constructor() {
    this.db = firestore;
  }

  async verifyPayment({ orderId, paymentId, signature }) {
    if (!orderId || !paymentId || !signature) {
      return {
        status: "failed",
        message: "Missing required parameters",
      };
    }
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    return expectedSignature === signature;
  }
}

module.exports = PaymentService;
