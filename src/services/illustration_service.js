const { firebaseConfig } = require("../config");
const { firestore } = firebaseConfig;
const { COLLECTIONS } = require("../constants");

class IllustrationService {
  constructor() {
    this.db = firestore;
    this.categoryCollection = COLLECTIONS.CATEGORIES;
    this.collection = COLLECTIONS.ILLUSTRATIONS;
  }

  async addIllustration({ categoryId, imageUrl }) {
    const createdAt = Date.now();
    const illustration = await this.db
      .collection(this.categoryCollection)
      .doc(categoryId)
      .collection(this.collection)
      .add({ categoryId, imageUrl, createdAt });

    this.db
      .collection(this.categoryCollection)
      .doc(categoryId)
      .collection(this.collection)
      .doc(illustration.id)
      .update({ id: illustration.id });

    return illustration.id;
  }

  async getIllustrationsByCategoryId(categoryId) {
    const illustrationsSnapshot = await this.db
      .collection(this.categoryCollection)
      .doc(categoryId)
      .collection(this.collection)
      .orderBy("createdAt", "desc")
      .get();

    return illustrationsSnapshot.docs.map((doc) => doc.data());
  }
}

module.exports = IllustrationService;
