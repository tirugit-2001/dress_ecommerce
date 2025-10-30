const { firebaseConfig } = require("../config");
const { firestore } = firebaseConfig;
const { COLLECTIONS } = require("../constants");

class CategoryService {
  constructor() {
    this.db = firestore;
    this.collection = COLLECTIONS.CATEGORIES;
  }

  async createCategory({ name, value, showBooks }) {
    const categorySnapshot = await this.db.collection(this.collection).get();

    const order = categorySnapshot.size + 1;

    const category = await this.db.collection(this.collection).add({
      name,
      value,
      showBooks,
      order,
    });

    this.db.collection(this.collection).doc(category.id).update({
      id: category.id,
    });

    return category.id;
  }

  async updateCategory({ categoryId, data }) {
    const category = await this.db
      .collection(this.collection)
      .doc(categoryId)
      .update(data);

    return category;
  }

  async updateCategoryOrder(categories) {
    try {
      const batch = this.db.batch();

      categories.forEach((category) => {
        const categoryRef = this.db
          .collection(this.collection)
          .doc(category.id);
        batch.update(categoryRef, { order: category.order });
      });

      await batch.commit();
      return true;
    } catch (error) {
      throw new Error("Failed to update category order: " + error.message);
    }
  }
  async getCategories({ fetchOnlyActive = false } = {}) {
    try {
      let categoryQuery = this.db.collection(this.collection);

      if (fetchOnlyActive) {
        categoryQuery = categoryQuery.where("isActive", "==", true);
      }

      categoryQuery = categoryQuery.orderBy("order", "asc");

      const categorySnapshot = await categoryQuery.get();

      const categoryItems = categorySnapshot.docs.map((doc) => doc.data());

      return categoryItems;
    } catch (error) {
      throw new Error("Failed to fetch categories: " + error.message);
    }
  }

  async getCategoryById({ categoryId }) {
    const category = await this.db
      .collection(this.collection)
      .doc(categoryId)
      .get();

    return category.exists ? category.data() : null;
  }
}

module.exports = CategoryService;
