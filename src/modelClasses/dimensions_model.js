class Dimension {
  constructor({ height, width, length, weight }) {
    this.height = height;
    this.width = width;
    this.length = length;
    this.weight = weight;
  }

  static fromFirestore(data) {
    return new Dimension({ ...data });
  }

  toFirestore() {
    return {
      height: this.height,
      width: this.width,
      length: this.length,
      weight: this.weight,
    };
  }
}

module.exports = Dimension;  // Ensure this line exists
