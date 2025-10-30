const Address = require("./address_model");

class Franchise {
  constructor({
    id,
    name,
    address,
    couponCode,
    unsettledAmount,
    settledAmount,
    commission,
    discount,
    createdAt,
  }) {
    this.id = id;
    this.name = name;
    this.address = new Address(address);
    this.couponCode = couponCode;
    this.unsettledAmount = unsettledAmount || 0;
    this.settledAmount = settledAmount || 0;
    this.commission = commission;
    this.discount = discount;
    this.createdAt = createdAt || new Date();
  }

  static fromFirestore(data) {
    return new Franchise({
      ...data,
      address: Address.fromFirestore(data.address),
    });
  }

  toFirestore() {
    return {
      id: this.id,
      name: this.name,
      address: this.address.toFirestore(),
      couponCode: this.couponCode,
      unsettledAmount: this.unsettledAmount,
      settledAmount: this.settledAmount,
      commission: this.commission,
      discount: this.discount,
      createdAt: this.createdAt,
    };
  }
}

module.exports = Franchise;
