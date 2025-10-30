const { TRANSACTION_TYPE } = require("../constants");

class Transaction {
  constructor({
    id,
    userId,
    franchiseId,
    createdAt,
    orderId,
    coupon,
    orderAmount,
    amount,
    type,
  }) {
    this.id = id;
    this.userId = userId;
    this.franchiseId = franchiseId;
    this.createdAt = createdAt || new Date();
    this.orderId = orderId;
    this.coupon = coupon;
    this.orderAmount = orderAmount;
    this.amount = amount;
    this.type = type || TRANSACTION_TYPE.COMMISSION;
  }

  static fromFirestore(data) {
    return new Transaction({
      ...data,
    });
  }

  toFirestore() {
    return {
      id: this.id,
      userId: this.userId,
      franchiseId: this.franchiseId,
      createdAt: this.createdAt,
      orderId: this.orderId,
      coupon: this.coupon,
      orderAmount: this.orderAmount,
      amount: this.amount,
      type: this.type,
    };
  }
}

module.exports = Transaction;
