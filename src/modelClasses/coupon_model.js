class Coupon {
  constructor({
    id,
    code,
    discount, // % discount
    maxUsage, // limit
    usedCount,
    expiresAt,
    isActive,
    createdAt,
  }) {
    this.id = id;
    this.code = code;
    this.discount = discount;
    this.maxUsage = maxUsage ?? null;
    this.usedCount = usedCount ?? 0;
    this.expiresAt = expiresAt ?? null;
    this.isActive = isActive ?? true;
    this.createdAt = createdAt || new Date();
  }

  toFirestore() {
    return {
      code: this.code,
      discount: this.discount,
      maxUsage: this.maxUsage,
      usedCount: this.usedCount,
      expiresAt: this.expiresAt,
      isActive: this.isActive,
      createdAt: this.createdAt,
    };
  }

  static fromFirestore(data) {
    return new Coupon(data);
  }
}

module.exports = Coupon;

