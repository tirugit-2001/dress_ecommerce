const { firebaseConfig } = require("../config");
const { firestore } = firebaseConfig;
const { COLLECTIONS, POLICIES } = require("../constants");

class PoliciesService {
  constructor() {
    this.db = firestore;
  }

  async getAboutUsData() {
    try {
      const ref = this.db
        .collection(COLLECTIONS.POLICIES)
        .doc(POLICIES.ABOUT_US);
      const doc = await ref.get();
      if (!doc.exists) {
        throw new Error("About Us document not found.");
      }
      return doc.data();
    } catch (error) {
      throw new Error("Failed to fetch About Us data.");
    }
  }

  async getPrivacyPolicyData() {
    try {
      const ref = this.db
        .collection(COLLECTIONS.POLICIES)
        .doc(POLICIES.PRIVACY_POLICY);
      const doc = await ref.get();
      if (!doc.exists) {
        throw new Error("Privacy Policy document not found.");
      }
      return doc.data();
    } catch (error) {
      throw new Error("Failed to fetch Privacy Policy data.");
    }
  }

  async getShippingPolicyData() {
    try {
      const ref = this.db
        .collection(COLLECTIONS.POLICIES)
        .doc(POLICIES.SHIPPING_POLICY);
      const doc = await ref.get();
      if (!doc.exists) {
        throw new Error("Shipping Policy document not found.");
      }
      return doc.data();
    } catch (error) {
      throw new Error("Failed to fetch Shipping Policy data.");
    }
  }

  async getRefundPolicyData() {
    try {
      const ref = this.db
        .collection(COLLECTIONS.POLICIES)
        .doc(POLICIES.REFUND_POLICY);
      const doc = await ref.get();
      if (!doc.exists) {
        throw new Error("Refund Policy document not found.");
      }
      return doc.data();
    } catch (error) {
      throw new Error("Failed to fetch Refund Policy data.");
    }
  }

  async getTermsAndConditionData() {
    try {
      const ref = this.db
        .collection(COLLECTIONS.POLICIES)
        .doc(POLICIES.TERMS_AND_CONDITION);
      const doc = await ref.get();
      if (!doc.exists) {
        throw new Error("Terms and Condition document not found.");
      }
      return doc.data();
    } catch (error) {
      throw new Error("Failed to fetch Terms and Condition data.");
    }
  }
}

module.exports = PoliciesService;
