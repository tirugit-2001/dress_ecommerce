const { firebaseConfig } = require("../config");
const { firestore } = firebaseConfig;
const { COLLECTIONS } = require("../constants");

class AddressService {
  constructor() {
    this.db = firestore;
  }

  async getAddressById({ userId, addressId }) {
    try {
      if (!userId) {
        throw new Error("UserId is required.");
      }

      if (!addressId) {
        throw new Error("AddressId is required.");
      }

      const addressRef = this.db
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .collection(COLLECTIONS.ADDRESS)
        .doc(addressId);

      const addressSnapshot = await addressRef.get();

      return addressSnapshot.exists ? addressSnapshot.data() : null;
    } catch (error) {
      throw new Error(`Failed to fetch address: ${error.message}`);
    }
  }

  async getAddresses(userId) {
    const addressCollectionRef = this.db
      .collection(COLLECTIONS.USERS)
      .doc(userId)
      .collection(COLLECTIONS.ADDRESS);

    const addressSnapshot = await addressCollectionRef.get();
    return addressSnapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(),
    }));
  }

  async addAddress(userId, addressData) {
    const addressCollectionRef = this.db
      .collection(COLLECTIONS.USERS)
      .doc(userId)
      .collection(COLLECTIONS.ADDRESS);

    const batch = this.db.batch();

    const newAddressRef = addressCollectionRef.doc();
    const addressWithId = { ...addressData, id: newAddressRef.id };
    batch.set(newAddressRef, addressWithId);
    await batch.commit();
    return { id: newAddressRef.id, ...addressWithId };
  }

  async editAddress({ userId, addressId, updatedData }) {
    const addressRef = this.db
      .collection(COLLECTIONS.USERS)
      .doc(userId)
      .collection(COLLECTIONS.ADDRESS)
      .doc(addressId);

    const address = await addressRef.get();
    if (!address.exists) {
      throw new Error("Address not found");
    }

    await addressRef.update(updatedData);
    return { id: addressId, ...updatedData };
  }

  async deleteAddress({ userId, addressId }) {
    const addressRef = this.db
      .collection(COLLECTIONS.USERS)
      .doc(userId)
      .collection(COLLECTIONS.ADDRESS)
      .doc(addressId);

    const address = await addressRef.get();
    if (!address.exists) {
      throw new Error("Address not found");
    }

    await addressRef.delete();
    return { success: true, id: addressId };
  }

  async changeDefaultAddress(userId, newDefaultAddressId) {
    const addressCollectionRef = this.db
      .collection(COLLECTIONS.USERS)
      .doc(userId)
      .collection(COLLECTIONS.ADDRESS);
    const addressSnapshot = await addressCollectionRef.get();

    const batch = this.db.batch();

    addressSnapshot.docs.forEach((doc) => {
      const isDefault = doc.id === newDefaultAddressId;
      batch.update(doc.ref, { isDefault });
    });

    await batch.commit();
    return { success: true, defaultAddressId: newDefaultAddressId };
  }
}

module.exports = AddressService;
