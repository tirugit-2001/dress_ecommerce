const { firebaseConfig } = require("../config");
const { firestore, FieldValue } = firebaseConfig;
const { GiftReward, GiftType } = require("../modelClasses/gift_reward_model");
const { COLLECTIONS } = require("../constants");

class GiftRewardService {
  constructor() {
    this.db = firestore;
    this.collection = COLLECTIONS.GIFT_REWARDS;
  }

  async createGiftReward(rewardData) {
    if (
      !rewardData.title ||
      rewardData.minOrderAmount === undefined ||
      !rewardData.giftType
    ) {
      throw new Error("Title, minOrderAmount, and giftType are required.");
    }
    if (!Object.values(GiftType).includes(rewardData.giftType)) {
      throw new Error(
        `Invalid giftType: ${
          rewardData.giftType
        }. Must be one of: ${Object.values(GiftType).join(", ")}`
      );
    }

    const docRef = this.db.collection(this.collection).doc();
    const newReward = new GiftReward({
      id: docRef.id,
      title: rewardData.title,
      minOrderAmount: rewardData.minOrderAmount,
      giftType: rewardData.giftType,
      discountPercentage: rewardData.discountPercentage ?? null,
      discountAmount: rewardData.discountAmount ?? null,
      productId: rewardData.productId ?? null,
      createdAt: new Date(),
      isActive: rewardData.isActive ?? true,
      updatedAt: new Date(),
    });

    const firestoreData = newReward.toFirestore();
    await docRef.set(firestoreData);

    return newReward;
  }

  async getGiftRewardById(id) {
    const doc = await this.db.collection(this.collection).doc(id).get();
    if (!doc.exists) {
      throw new Error("Gift Reward not found");
    }
    return GiftReward.fromFirestore({ id: doc.id, ...doc.data() });
  }

  async getAllGiftRewards() {
    const snapshot = await this.db.collection(this.collection).get();
    return snapshot.docs.map((doc) =>
      GiftReward.fromFirestore({ id: doc.id, ...doc.data() })
    );
  }

  async updateGiftReward(id, updates) {
    const ref = this.db.collection(this.collection).doc(id);

    const reward = new GiftReward({
      ...updates,
      updatedAt: new Date(),
    });
    const cleanUpdates = Object.fromEntries(
      Object.entries(reward.toFirestore()).filter(
        ([_, value]) => value !== undefined
      )
    );
    await ref.update(cleanUpdates);

    const updatedDoc = await ref.get();
    if (!updatedDoc.exists) {
      throw new Error("Gift Reward not found after update attempt.");
    }
    return GiftReward.fromFirestore({
      id: updatedDoc.id,
      ...updatedDoc.data(),
    });
  }

  async deleteGiftReward(id) {
    try {
      await this.db.collection(this.collection).doc(id).delete();
      return { id, message: "Gift Reward deleted successfully." };
    } catch (e) {
      console.error("Error deleting gift reward in service:", e);
      throw new Error("Failed to delete Gift Reward, it might not exist.");
    }
  }
}

module.exports = GiftRewardService;
