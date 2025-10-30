const admin = require("firebase-admin");
const { firestore } = admin;

const GiftType = {
  DISCOUNT: "discount",
  PRODUCT: "product",
  FREE_DELIVERY: "freeDelivery",
  OTHER: "other",
};

class GiftReward {
  constructor({
    id,
    title,
    minOrderAmount,
    giftType, 
    discountPercentage, 
    discountAmount,     
    productId,      
    createdAt = new Date(),
    isActive = true,    
    updatedAt = new Date(), 
  }) {
    this.id = id;
    this.title = title;
    this.minOrderAmount = minOrderAmount;
    this.giftType = giftType;
    this.discountPercentage = discountPercentage;
    this.discountAmount = discountAmount;
    this.productId = productId;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.isActive = isActive;
    this.updatedAt = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
  }

  static fromFirestore(data) {
    return new GiftReward({
      id: data.id,
      title: data.title || "",
      minOrderAmount: data.minOrderAmount ?? 0,
      giftType: data.giftType || GiftType.OTHER, 
      discountPercentage: data.discountPercentage ?? null,
      discountAmount: data.discountAmount ?? null,
      productId: data.productId ?? null,
      createdAt: data.createdAt ? data.createdAt.toDate() : new Date(), 
      isActive: data.isActive ?? true,
      updatedAt: data.updatedAt ? data.updatedAt.toDate() : new Date(), 
    });
  }

  toFirestore() {
    return {
      title: this.title,
      minOrderAmount: this.minOrderAmount,
      giftType: this.giftType,
      discountPercentage: this.discountPercentage,
      discountAmount: this.discountAmount,
      productId: this.productId,
      createdAt: firestore.Timestamp.fromDate(this.createdAt), 
      isActive: this.isActive,
      updatedAt: firestore.Timestamp.fromDate(this.updatedAt),
    };
  }
}

module.exports = { GiftReward, GiftType }; 