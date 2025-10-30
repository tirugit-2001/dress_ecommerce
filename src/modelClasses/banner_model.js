class Banner {
  constructor({ id, imageUrl, categoryId, order, isActive }) {
    this.id = id;
    this.imageUrl = imageUrl;
    this.categoryId = categoryId;
    this.order = order;
    this.isActive = isActive;
  }

  static fromFirestore(data) {
    return new Banner({ ...data });
  }

  toFirestore() {
    return {
      id: this.id,
      imageUrl: this.imageUrl,
      categoryId: this.categoryId,
      order: this.order,
      isActive: this.isActive,
    };
  }
}

module.exports = Banner;
