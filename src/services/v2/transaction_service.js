const { firebaseConfig } = require("../../config");
const { firestore } = firebaseConfig;

const { COLLECTIONS } = require("../../constants");
const { Transaction } = require("../../modelClasses");

class TransactionService {
  constructor() {
    this.db = firestore;
    this.collection = COLLECTIONS.TRANSACTIONS;
  }

  async createTransaction(franchiseId, data) {
    const transactionRef = this.db
      .collection(COLLECTIONS.FRANCHISE)
      .doc(franchiseId)
      .collection(this.collection)
      .doc();

    const transaction = new Transaction({
      ...data,
      id: transactionRef.id,
    });
    await transactionRef.set(transaction.toFirestore());
    return transaction;
  }

  async getTransactionByFranchiseId(franchiseId) {
    try {
      const transactions = this.db
        .collection(COLLECTIONS.FRANCHISE)
        .doc(franchiseId)
        .collection(this.collection)
        .get();

      return transactions.docs.map((doc) =>
        Transaction.fromFirestore(doc.data())
      );
    } catch (error) {
      throw new Error("Transaction not found");
    }
  }
}

module.exports = TransactionService;
