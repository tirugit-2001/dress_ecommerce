const ORDER_STATUS = {
  PAYMENT_PENDING: "paymentPending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY: "ready",
  SHIPPED: "shipped",
  OUT_FOR_DELIVERY: "outForDelivery",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  RETURNED: "returned",
  REFUNDED: "refunded",

  fromName: function (name) {
    return (
      Object.values(ORDER_STATUS).find(
        (status) => status.toLowerCase() === name.toLowerCase()
      ) || ORDER_STATUS.PAYMENT_PENDING
    );
  },
};

module.exports = ORDER_STATUS;
