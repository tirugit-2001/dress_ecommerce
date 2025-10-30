const admin = require("firebase-admin");
const { firestore } = admin;

class PromoHeadline {
  constructor({
    id,
    headline,
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.id = id;
    this.headline = headline;
    this.isActive = isActive;
    this.createdAt =
      createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.updatedAt =
      updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
  }

  static fromFirestore(data) {
    return new PromoHeadline({
      id: data.id,
      headline: data.headline || "",
      isActive: data.isActive ?? true,
      createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt ? data.updatedAt.toDate() : new Date(),
    });
  }

  toFirestore() {
    return {
      headline: this.headline,
      isActive: this.isActive,
      createdAt: firestore.Timestamp.fromDate(this.createdAt),
      updatedAt: firestore.Timestamp.fromDate(this.updatedAt),
    };
  }
}

module.exports = PromoHeadline;
