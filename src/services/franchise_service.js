const { firebaseConfig } = require("../config");
const { firestore } = firebaseConfig;
const { Franchise } = require("../modelClasses");
const { COLLECTIONS } = require("../constants");

class FranchiseService {
  constructor() {
    this.db = firestore;
    this.collection = COLLECTIONS.FRANCHISE;
  }

  async createFranchise(data) {
    const franchiseRef = this.db.collection(this.collection).doc();
    const franchise = new Franchise({ ...data, id: franchiseRef.id });
    await franchiseRef.set(franchise.toFirestore());
    return franchise;
  }

  async getAllFranchises() {
    const snapshot = await this.db.collection(this.collection).get();
    return snapshot.docs.map((doc) =>
      Franchise.fromFirestore({ ...doc.data(), id: doc.id })
    );
  }

  async getFranchiseById(id) {
    const doc = await this.db.collection(this.collection).doc(id).get();
    if (!doc.exists) throw new Error("Franchise not found");

    return Franchise.fromFirestore({ id: doc.id, ...doc.data() });
  }

  async getFranchiseByCouponCode(couponCode) {
    const franchiseSnapshot = await this.db
      .collection(this.collection)
      .where("couponCode", "==", couponCode)
      .get();

    if (franchiseSnapshot.empty) {
      return null;
    }

    const franchiseDoc = franchiseSnapshot.docs[0];
    return Franchise.fromFirestore({
      ...franchiseDoc.data(),
      id: franchiseDoc.id,
    });
  }

  async updateFranchise(id, data) {
    delete data.couponCode;
    const franchiseRef = this.db.collection(this.collection).doc(id);
    await franchiseRef.update({ ...data, id });

    return { id, ...data };
  }

  async settleUnsettledCommission(id, amount) {
    const franchiseRef = this.db.collection(this.collection).doc(id);
    const franchise = await franchiseRef.get();
    if (!franchise.exists) {
      throw new Error("Franchise not found");
    }
    const franchiseData = franchise.data();
    const newSettledAmount = franchiseData.settledAmount + amount;
    const newUnsettledAmount = franchiseData.unsettledAmount - amount;
    await franchiseRef.update({
      settledAmount: newSettledAmount,
      unsettledAmount: newUnsettledAmount,
    });
    return {
      id,
      settledAmount: newSettledAmount,
      unsettledAmount: newUnsettledAmount,
    };
  }

  async deleteFranchise(id) {
    try {
      await this.db.collection(this.collection).doc(id).delete();
    } catch (e) {
      throw new Error("Franchise not found");
    }
  }
}

module.exports = FranchiseService;
