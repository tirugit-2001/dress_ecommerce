const express = require("express");

const productRoutes = require("./products_routes");
const bannerRoutes = require("./banner_routes");
const wishlistRoutes = require("./wishlist_routes");
const franchiseRoutes = require("./franchise_routes");
const couponRoutes = require("./coupon_routes");
const promoheadlineRoutes = require("./promo_headline_routes")
const giftrewardRoutes = require("./gift_reward_routes")
const { authMiddleware } = require("../../middlewares");

const router = express.Router();

router.get("/health", (req, res) => {
  res.sendSuccess({ message: "v2 is working" });
});

router.use("/product", productRoutes);

router.use("/banner", bannerRoutes);

router.use("/promo-headline", promoheadlineRoutes);

router.use(authMiddleware);

router.use("/giftreward", giftrewardRoutes);

router.use("/coupon", couponRoutes);

router.use("/wishlist", wishlistRoutes);

router.use("/franchise", franchiseRoutes);



module.exports = router;
