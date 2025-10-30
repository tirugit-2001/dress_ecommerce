const { firebaseConfig } = require("../config");
const { firestore } = firebaseConfig;
const { COLLECTIONS } = require("../constants");

class SubCategoryService {
  constructor() {
    this.db = firestore;
    this.categoryCollection = COLLECTIONS.CATEGORIES;
    this.collection = COLLECTIONS.SUB_CATEGORIES;
  }

  async createSubCategory({ categoryId, data }) {
    const subCategorySnapshot = await this.db
      .collection(this.categoryCollection)
      .doc(categoryId)
      .collection(this.collection)
      .get();

    const order = subCategorySnapshot.size + 1;

    const subCategory = await this.db
      .collection(this.categoryCollection)
      .doc(categoryId)
      .collection(this.collection)
      .add({ ...data, order });

    this.db
      .collection(this.categoryCollection)
      .doc(categoryId)
      .collection(this.collection)
      .doc(subCategory.id)
      .update({
        id: subCategory.id,
      });

    return subCategory.id;
  }

  async updateSubCategory({ categoryId, subCategoryId, data }) {
    const subCategory = await this.db
      .collection(this.categoryCollection)
      .doc(categoryId)
      .collection(this.collection)
      .doc(subCategoryId)
      .update(data);

    return subCategory;
  }

  async getSubCategoriesByCategoryId(categoryId) {
    try {
      const subCategorySnapshot = await this.db
        .collection(this.categoryCollection)
        .doc(categoryId)
        .collection(this.collection)
        .orderBy("order", "asc")
        .get();

      const subCategoryItems = subCategorySnapshot.docs.map((doc) =>
        doc.data()
      );

      return subCategoryItems;
    } catch (error) {
      throw new Error("Failed to fetch sub-categories: " + error.message);
    }
  }

  async getSubCategoryById({ subCategoryId, categoryId }) {
    try {
      const subCategory = await this.db
        .collection(this.categoryCollection)
        .doc(categoryId)
        .collection(this.collection)
        .doc(subCategoryId)
        .get();

      return subCategory.exists ? subCategory.data() : null;
    } catch (error) {
      throw new Error("Failed to fetch sub-category: " + error.message);
    }
  }

  async getSubcategoriesWithOption({ categoryId, option }) {
    const subcategories = await this.getSubCategoriesByCategoryId(categoryId);
    const subcategoriesWithOption = subcategories.filter((subcategory) =>
      subcategory.fields.some((field) => field === option)
    );

    return subcategoriesWithOption;
  }
}

module.exports = SubCategoryService;
