const COLLECTIONS = {
  CATEGORIES: "categories",
  USERS: "users",
  ORDERS: "orders",
  CART: "cart",
  ADDRESS: "address",
  PROPERTIES: "properties",
  SUB_CATEGORIES: "subcategories",
  ILLUSTRATIONS: "illustrations",
  CONFIGURATIONS: "configurations",
  HELP_CENTER: "help-center",
  ABOUT_US: "about-us",
  PRODUCTS: "products",
  POLICIES: "policies",
  BANNER: "banner",
  WISHLIST: "wishlist",
  FRANCHISE: "franchise",
  COUPON:"coupon",
  PROMO_HEADLINES: "promoHeadlines",
  GIFT_REWARDS: "giftRewards",
  TRANSACTIONS: "transactions",
  COLLECTIONS: "collections",
};

const POLICIES = {
  ABOUT_US: "aboutUs",
  PRIVACY_POLICY: "privacyPolicy",
  SHIPPING_POLICY: "shippingPolicy",
  REFUND_POLICY: "refundPolicy",
  TERMS_AND_CONDITION: "termsAndCondition",
};

Object.freeze(COLLECTIONS);
Object.freeze(POLICIES);

module.exports = { COLLECTIONS, POLICIES };
