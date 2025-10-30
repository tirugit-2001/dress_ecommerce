const { firebaseConfig } = require("../config");
const { firestore } = firebaseConfig;
const { COLLECTIONS } = require("../constants");

class CartService {
  constructor() {
    this.db = firestore;
  }

  async getCartById({ userId, cartId }) {
    try {
      if (!userId) {
        throw new Error("UserId is required.");
      }

      if (!cartId) {
        throw new Error("CartId is required.");
      }

      const cartRef = this.db
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .collection(COLLECTIONS.CART)
        .doc(cartId);

      const cartSnapshot = await cartRef.get();

      if (!cartSnapshot.exists) {
        throw new Error("Cart item not found.");
      }

      return cartSnapshot.data();
    } catch (error) {
      throw new Error(`Failed to fetch cart: ${error.message}`);
    }
  }

  async getCartByUserId({ userId }) {
    try {
      if (!userId) {
        throw new Error("UserId is required.");
      }

      const cartSnapshot = await this.db
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .collection(COLLECTIONS.CART)
        .get();

      const cartItems = cartSnapshot.docs.map((doc) => {
        const data = doc.data();
        if (typeof data.isCustomizable === "undefined") {
          data.isCustomizable = true;
        }
        return data;
      });

      return cartItems;
    } catch (error) {
      throw new Error("Failed to fetch cart.");
    }
  }

  async getCartCountById({ userId }) {
    try {
      if (!userId) {
        throw new Error("UserId is required.");
      }

      const cartSnapshot = await this.db
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .collection(COLLECTIONS.CART)
        .get();

      if (cartSnapshot.empty) {
        return 0;
      }

      return cartSnapshot.docs.length;
    } catch (error) {
      throw new Error("Failed to fetch cart.");
    }
  }

  async addItem(userId, itemData) {
    try {
      if (!userId || !itemData) {
        throw new Error(
          "Both userId and itemData are required to add an item."
        );
      }

      const cartCollectionRef = this.db
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .collection(COLLECTIONS.CART);

      const batch = this.db.batch();
      const newItemRef = cartCollectionRef.doc();
      const itemWithId = { ...itemData, id: newItemRef.id };

      batch.set(newItemRef, itemWithId);

      await batch.commit();
      return { id: newItemRef.id, ...itemWithId };
    } catch (error) {
      throw new Error("Failed to add item to cart.");
    }
  }

  async editItem({ userId, itemId, newQuantity }) {
    try {
      if (!userId || !itemId || newQuantity === undefined) {
        throw new Error("userId, itemId, and newQuantity are required.");
      }

      const cartItemRef = this.db
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .collection(COLLECTIONS.CART)
        .doc(itemId);

      const cartItem = await cartItemRef.get();

      if (!cartItem.exists) {
        throw new Error("Item does not exist in the cart.");
      }

      await cartItemRef.update({ quantity: newQuantity });

      return { success: true, message: "Item quantity updated successfully" };
    } catch (error) {
      throw new Error("Failed to edit item in cart.");
    }
  }

  async removeItem({ userId, itemId }) {
    try {
      if (!userId || !itemId) {
        throw new Error(
          "Both userId and itemId are required to remove an item."
        );
      }

      const cartItemRef = this.db
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .collection(COLLECTIONS.CART)
        .doc(itemId);

      const cartItem = await cartItemRef.get();

      if (!cartItem.exists) {
        throw new Error("Item does not exist in the cart.");
      }

      await cartItemRef.delete();
      return { success: true, message: "Item removed successfully" };
    } catch (error) {
      throw new Error("Failed to remove item from cart.");
    }
  }
}

module.exports = CartService;
