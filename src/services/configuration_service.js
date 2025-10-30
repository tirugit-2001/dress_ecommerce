const { firebaseConfig } = require("../config");
const { firestore } = firebaseConfig;
const { COLLECTIONS } = require("../constants");

class ConfigurationService {
  constructor() {
    this.db = firestore;
    this.categoryCollection = COLLECTIONS.CATEGORIES;
    this.collection = COLLECTIONS.CONFIGURATIONS;
  }

  async createConfiguration({ categoryId, data }) {
    try {
      const configuration = await this.db
        .collection(this.categoryCollection)
        .doc(categoryId)
        .collection(this.collection)
        .add(data);

      this.db
        .collection(this.categoryCollection)
        .doc(categoryId)
        .collection(this.collection)
        .doc(configuration.id)
        .update({
          id: configuration.id,
        });

      return configuration.id;
    } catch (error) {
      throw new Error("Failed to create configuration: " + error.message);
    }
  }

  async updateConfiguration({ categoryId, configurationId, data }) {
    try {
      const configuration = await this.db
        .collection(this.categoryCollection)
        .doc(categoryId)
        .collection(this.collection)
        .doc(configurationId)
        .update(data);

      return configuration;
    } catch (error) {
      throw new Error("Failed to update configuration: " + error.message);
    }
  }

  async getConfigurationsByCategoryId(categoryId) {
    try {
      const configurationsSnapshot = await this.db
        .collection(this.categoryCollection)
        .doc(categoryId)
        .collection(this.collection)
        .get();

      const configurationsItems = configurationsSnapshot.docs.map((doc) =>
        doc.data()
      );

      return configurationsItems;
    } catch (error) {
      throw new Error("Failed to fetch configurations: " + error.message);
    }
  }

  async getConfigurationById({ categoryId, configurationId }) {
    try {
      const configuration = await this.db
        .collection(this.categoryCollection)
        .doc(categoryId)
        .collection(this.collection)
        .doc(configurationId)
        .get();

      return configuration.exists ? configuration.data() : null;
    } catch (error) {
      throw new Error("Failed to fetch configuration: " + error.message);
    }
  }
}

module.exports = ConfigurationService;
