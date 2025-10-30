const { firebaseConfig } = require("../config");
const { firestore, FieldValue } = firebaseConfig;
const { Coupon } = require("../modelClasses");
const { COLLECTIONS } = require("../constants");

class CouponService {
  constructor() {
    this.db = firestore;
    this.collection = COLLECTIONS.COUPON;
  }

  async findCouponOrFranchise(code) {
    
    const couponSnap = await this.db
      .collection(this.collection)
      .where("code", "==", code)
      .limit(1)
      .get();

    if (!couponSnap.empty) {
      const doc = couponSnap.docs[0];
      const coupon = Coupon.fromFirestore({ id: doc.id, ...doc.data() });

      if (!coupon.isActive) {
        return { error: true, reason: "Coupon is inactive" };
      }

      if (coupon.maxUsage !== null && coupon.usedCount >= coupon.maxUsage) {
        return { error: true, reason: "Coupon usage limit exceeded"};
      }

      if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
        return { error: true, reason: "Coupon has expired"};
      }

      return { source: "coupon", coupon, discount: coupon.discount };
    }

    const franchiseSnap = await this.db
      .collection(COLLECTIONS.FRANCHISE)
      .where("couponCode", "==", code)
      .limit(1)
      .get();

    if (!franchiseSnap.empty) {
      const doc = franchiseSnap.docs[0];
      return {
        source: "franchise",
        franchise: { id: doc.id, ...doc.data() },
        discount: doc.data().discount,
      };
    }

    return null;
  }

  async incrementUsedCount(couponId) {
    const ref = this.db.collection(this.collection).doc(couponId);
    await ref.update({
      usedCount: FieldValue.increment(1),
    });
  }

  async createCoupon(data) {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    const docRef = this.db.collection(this.collection).doc();
    
    const coupon = new Coupon({ ...cleanData, id: docRef.id });
    const firestoreData = coupon.toFirestore();
  
     await docRef.set(firestoreData);
    return coupon;
  }

  async updateCoupon(id, updates) {
    const ref = this.db.collection(this.collection).doc(id);

    await ref.update(updates);
    return { id, ...updates };
  }

  async deleteCoupon(id) {
    try {
      await this.db.collection(this.collection).doc(id).delete();
    } catch (e) {
      throw new Error("Coupon not found");
    }
  }

  async getCouponById(id) {
    const doc = await this.db.collection(this.collection).doc(id).get();

    if (!doc.exists) {
      throw new Error("Coupon not found");
    }

    return Coupon.fromFirestore({ id: doc.id, ...doc.data() });
  }

  async getAllCoupons() {
    const snapshot = await this.db.collection(this.collection).get();
    return snapshot.docs.map((doc) =>
      Coupon.fromFirestore({ id: doc.id, ...doc.data() })
    );
  }
}

module.exports = CouponService;
