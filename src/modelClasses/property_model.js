class Property {
  constructor({ options, type }) {
    this.options = options;
    this.type = type;
  }

  static fromFirestore(data) {
    return new Property({
      options: data.options,
      type: data.type,
    });
  }

  toFirestore() {
    return {
      options: this.options,
      type: this.type,
    };
  }
}

module.exports = Property; // Ensure it's exported correctly
