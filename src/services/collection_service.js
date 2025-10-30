const { firebaseConfig } = require("../config");
const { firestore, FieldValue } = firebaseConfig;
const { COLLECTIONS } = require("../constants");

class CollectionService {
  constructor() {
    this.db = firestore;
    this.categoryCollection = COLLECTIONS.CATEGORIES;
    this.collection = COLLECTIONS.COLLECTIONS;
    this.productCollection = COLLECTIONS.PRODUCTS;
  }

  async createCollection({ categoryId, data }) {
    const collectionSnapshot = await this.db
      .collection(this.categoryCollection)
      .doc(categoryId)
      .collection(this.collection)
      .get();

    const order = collectionSnapshot.size + 1;

    const collection = await this.db
      .collection(this.categoryCollection)
      .doc(categoryId)
      .collection(this.collection)
      .add({ ...data, order });

    this.db
      .collection(this.categoryCollection)
      .doc(categoryId)
      .collection(this.collection)
      .doc(collection.id)
      .update({
        id: collection.id,
      });

    return collection.id;
  }

  async updateCollection({ categoryId, collectionId, data }) {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== null && value !== undefined
      )
    );

    const collection = await this.db
      .collection(this.categoryCollection)
      .doc(categoryId)
      .collection(this.collection)
      .doc(collectionId)
      .update(cleanData);

    return collection;
  }

  async getCollectionsByCategoryId(categoryId, { fetchActive = false } = {}) {
    try {
      let query = this.db
        .collection(this.categoryCollection)
        .doc(categoryId)
        .collection(this.collection);

      if (fetchActive) {
        query = query.where("isActive", "==", true);
      }

      const collectionSnapshot = await query.get();

      const collectionItems = collectionSnapshot.docs.map((doc) => doc.data());

      return collectionItems;
    } catch (error) {
      throw new Error("Failed to fetch collections: " + error.message);
    }
  }

  async getCollectionByIdentifier({ identifier, categoryId }) {
    try {
      if (!identifier) {
        throw new Error("Collection ID is required.");
      }

      const collection = await this.db
        .collection(this.categoryCollection)
        .doc(categoryId)
        .collection(this.collection)
        .doc(identifier)
        .get();

      if (collection.exists) {
        return collection.data();
      }

      const collectionSnapshot = await this.db
        .collection(this.categoryCollection)
        .doc(categoryId)
        .collection(this.collection)
        .where("slug", "==", identifier)
        .get();

      if (collectionSnapshot.empty) {
        return null;
      }

      const collectionBySlug = collectionSnapshot.docs[0];
      return collectionBySlug.data();
    } catch (error) {
      throw new Error("Failed to fetch collection: " + error.message);
    }
  }

  async addProductsToCollection({ categoryId, collectionId, productIds }) {
    try {
      const batch = this.db.batch();

      // Update collection with new product IDs
      const collectionRef = this.db
        .collection(this.categoryCollection)
        .doc(categoryId)
        .collection(this.collection)
        .doc(collectionId);

      batch.update(collectionRef, {
        productIds: FieldValue.arrayUnion(...productIds),
      });

      // Update each product with the collection ID
      for (const productId of productIds) {
        const productRef = this.db
          .collection(COLLECTIONS.PRODUCTS)
          .doc(productId);
        batch.update(productRef, {
          collectionIds: FieldValue.arrayUnion(collectionId),
        });
      }

      await batch.commit();

      return batch;
    } catch (error) {
      throw new Error("Failed to add products to collection: " + error.message);
    }
  }

  async removeProductsFromCollection({ categoryId, collectionId, productIds }) {
    try {
      const batch = this.db.batch();

      // Remove product IDs from collection
      const collectionRef = this.db
        .collection(this.categoryCollection)
        .doc(categoryId)
        .collection(this.collection)
        .doc(collectionId);

      batch.update(collectionRef, {
        productIds: FieldValue.arrayRemove(...productIds),
      });

      // Remove collection ID from each product
      for (const productId of productIds) {
        const productRef = this.db
          .collection(COLLECTIONS.PRODUCTS)
          .doc(productId);
        batch.update(productRef, {
          collectionIds: FieldValue.arrayRemove(collectionId),
        });
      }

      await batch.commit();

      return batch;
    } catch (error) {
      throw new Error(
        "Failed to remove products from collection: " + error.message
      );
    }
  }
}

module.exports = CollectionService;
