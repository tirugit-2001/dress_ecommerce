const { firebaseConfig } = require("../../config");
const { firestore } = firebaseConfig;
const { COLLECTIONS } = require("../../constants");
const { Banner } = require("../../modelClasses");

class BannerService {
  constructor() {
    this.db = firestore;
    this.collection = COLLECTIONS.BANNER;
  }

  async getBannersByCategory(categoryId) {
    try {
      const bannerSnapshot = await this.db
        .collection(COLLECTIONS.CATEGORIES)
        .doc(categoryId)
        .collection(this.collection)
        .where("isActive", "==", true)
        .orderBy("order", "asc")
        .get();

      const banners = bannerSnapshot.docs.map((doc) =>
        Banner.fromFirestore({ id: doc.id, ...doc.data() })
      );

      return banners;
    } catch (error) {
      throw new Error(
        `Failed to fetch banners by categoryId - ${categoryId}\n${error}`
      );
    }
  }

  async createBanner(data) {
    try {
      const { imageUrl, categoryId } = data;
      if (!imageUrl || !categoryId) {
        throw new Error("Image URL and categoryId are required.");
      }

      const batch = this.db.batch();

      const collectionRef = this.db
        .collection(COLLECTIONS.CATEGORIES)
        .doc(categoryId)
        .collection(this.collection);

      const bannerSnapshot = await collectionRef.get();

      const order = bannerSnapshot.size + 1;

      const bannerRef = collectionRef.doc();

      const bannerWithId = {
        imageUrl,
        categoryId,
        order,
        id: bannerRef.id,
        isActive: true,
      };

      const banner = new Banner(bannerWithId);

      batch.set(bannerRef, banner.toFirestore());

      await batch.commit();

      return bannerWithId;
    } catch (error) {
      throw new Error("Failed to create banner. " + error);
    }
  }

  async updateBannerOrders({ categoryId, orderUpdates }) {
    try {
      if (!Array.isArray(orderUpdates) || orderUpdates.length === 0) {
        throw new Error("orderUpdates must be a non-empty array.");
      }
      const batch = this.db.batch();
      for (const { order, bannerId } of orderUpdates) {
        if (typeof order !== "number" || !bannerId) {
          throw new Error(
            "Each item in orderUpdates must have a numeric 'order' and a valid 'bannerId'."
          );
        }
        const bannerRef = this.db
          .collection(COLLECTIONS.CATEGORIES)
          .doc(categoryId)
          .collection(this.collection)
          .doc(bannerId);
        batch.update(bannerRef, { order });
      }
      await batch.commit();
      return "Banner orders updated successfully.";
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update banner orders. " + error.message);
    }
  }

  async updateBanner({ bannerId, categoryId, isActive }) {
    try {
      if (typeof isActive !== "boolean") {
        throw new Error("isActive must be a boolean value");
      }

      const bannerRef = this.db
        .collection(COLLECTIONS.CATEGORIES)
        .doc(categoryId)
        .collection(this.collection)
        .doc(bannerId);

      const batch = this.db.batch();
      batch.update(bannerRef, { isActive });

      await batch.commit();

      return { message: "Banner status updated successfully" };
    } catch (error) {
      throw new Error("Failed to update banner status. " + error);
    }
  }
}

module.exports = BannerService;
