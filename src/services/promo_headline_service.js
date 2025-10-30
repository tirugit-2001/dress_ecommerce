const { firebaseConfig } = require("../config");
const { firestore, FieldValue } = firebaseConfig;
const { PromoHeadline } = require("../modelClasses");
const { COLLECTIONS } = require("../constants");

class PromoHeadlineService {
  constructor() {
    this.db = firestore;
    this.collection = COLLECTIONS.PROMO_HEADLINES;
  }

  async createHeadline(headlineData) {
    if (!headlineData.headline) {
      throw new Error("Headline content is required.");
    }

    const docRef = this.db.collection(this.collection).doc();
    const headline = new PromoHeadline({
      id: docRef.id,
      headline: headlineData.headline,
      isActive: headlineData.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const firestoreData = headline.toFirestore();
    await docRef.set(firestoreData);

    return headline;
  }

  async getHeadlineById(id) {
    const doc = await this.db.collection(this.collection).doc(id).get();

    if (!doc.exists) {
      throw new Error("Promo Headline not found");
    }

    return PromoHeadline.fromFirestore({ id: doc.id, ...doc.data() });
  }

  async getAllHeadlines() {
    const snapshot = await this.db.collection(this.collection).get();
    return snapshot.docs.map((doc) =>
      PromoHeadline.fromFirestore({ id: doc.id, ...doc.data() })
    );
  }

  async updateHeadline(id, updates) {
    const ref = this.db.collection(this.collection).doc(id);

    const headline = new PromoHeadline({
      ...updates,
      updatedAt: new Date(),
    });

    await ref.update(headline.toFirestore());

    const updatedDoc = await ref.get();
    if (!updatedDoc.exists) {
      throw new Error("Promo Headline not found after update attempt.");
    }
    return PromoHeadline.fromFirestore({
      id: updatedDoc.id,
      ...updatedDoc.data(),
    });
  }

  async deleteHeadline(id) {
    try {
      await this.db.collection(this.collection).doc(id).delete();
      return { id, message: "Promo Headline deleted successfully." };
    } catch (e) {
      throw new Error("Promo Headline not found");
    }
  }

  async getActiveHeadlines(limitToOne = false) {
    let query = this.db
      .collection(this.collection)
      .where("isActive", "==", true)
      .orderBy("createdAt", "desc");

    if (limitToOne) {
      query = query.limit(1);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) =>
      PromoHeadline.fromFirestore({ id: doc.id, ...doc.data() })
    );
  }
}

module.exports = PromoHeadlineService;
