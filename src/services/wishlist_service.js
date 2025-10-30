const { firebaseConfig } = require("../config");
const { firestore } = firebaseConfig;
const { COLLECTIONS } = require("../constants");

class WishlistService {
  constructor() {
    this.db = firestore;
    this.userCollection = COLLECTIONS.USERS;
    this.collection = COLLECTIONS.WISHLIST;
  }

  async getWishlistByUserId({ userId }) {
    try {
      if (!userId) {
        throw new Error("UserId is required.");
      }

      const wishlistSnapshot = await this.db
        .collection(this.userCollection)
        .doc(userId)
        .collection(this.collection)
        .get();

      if (wishlistSnapshot.empty) {
        return [];
      }

      const wishlistItems = wishlistSnapshot.docs.map((doc) => doc.data());

      return wishlistItems;
    } catch (error) {
      throw new Error("Failed to fetch wishlist.");
    }
  }

  async addToWishlist({ userId, productId }) {
    try {
      if (!userId || !productId) {
        throw new Error("Both userId and productId are required.");
      }

      const wishlistRef = this.db
        .collection(this.userCollection)
        .doc(userId)
        .collection(this.collection)
        .doc(productId);

      await wishlistRef.set({
        id: wishlistRef.id,
        userId,
        productId,
        createdAt: new Date(),
      });

      return {
        success: true,
        message: "Product added to wishlist successfully",
      };
    } catch (error) {
      throw new Error("Failed to add product to wishlist.");
    }
  }

  async removeFromWishlist({ userId, productId }) {
    try {
      if (!userId || !productId) {
        throw new Error("Both userId and productId are required.");
      }

      const wishlistRef = this.db
        .collection(this.userCollection)
        .doc(userId)
        .collection(this.collection)
        .doc(productId);

      await wishlistRef.delete();

      return {
        success: true,
        message: "Product removed from wishlist successfully",
      };
    } catch (error) {
      throw new Error("Failed to remove product from wishlist.");
    }
  }

  async isProductInWishlist({ userId, productId }) {
    try {
      if (!userId || !productId) {
        throw new Error("Both userId and productId are required.");
      }

      const wishlistRef = await this.db
        .collection(this.userCollection)
        .doc(userId)
        .collection(this.collection)
        .doc(productId)
        .get();

      return wishlistRef.exists;
    } catch (error) {
      throw new Error("Failed to check wishlist status.");
    }
  }
}

module.exports = WishlistService;
