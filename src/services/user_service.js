const { firebaseConfig } = require("../config");
const { firestore } = firebaseConfig;
const { COLLECTIONS } = require("../constants");

class UserService {
  constructor() {
    this.db = firestore;
  }

  async getUserById(userId) {
    try {
      if (!userId) {
        throw new Error("UserId is required.");
      }

      const userRef = this.db.collection(COLLECTIONS.USERS).doc(userId);

      const userSnapshot = await userRef.get();

      if (!userSnapshot.exists) {
        throw new Error("User not found.");
      }

      return userSnapshot.data();
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }
}

module.exports = UserService;
