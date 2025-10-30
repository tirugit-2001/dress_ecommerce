class Address {
  constructor({
    id,
    name,
    mobile,
    email,
    line1,
    line2,
    city,
    state,
    country,
    pinCode,
    isDefault = false,
  }) {
    this.id = id;
    this.name = name;
    this.mobile = mobile;
    this.email = email;
    this.line1 = line1;
    this.line2 = line2;
    this.city = city;
    this.state = state;
    this.country = country;
    this.pinCode = pinCode;
    this.isDefault = isDefault;
  }

  static fromFirestore(data) {
    return new Address({ ...data });
  }

  toFirestore() {
    return {
      id: this.id,
      name: this.name,
      mobile: this.mobile,
      email: this.email,
      line1: this.line1,
      line2: this.line2,
      city: this.city,
      state: this.state,
      country: this.country,
      pinCode: this.pinCode,
      isDefault: this.isDefault,
    };
  }
}

module.exports = Address;
