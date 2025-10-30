const express = require("express");
const orderRoutes = require("./order_routes");
const paymentRoutes = require("./payment_routes");
const addressRoutes = require("./address_routes");
const cartRoutes = require("./cart_routes");
const categoryRoutes = require("./category_routes");
const policiesRoutes = require("./policies_routes");
const { authMiddleware } = require("../../middlewares");

const router = express.Router();

router.get("/health", (req, res) => {
  res.sendSuccess({ message: "v1 is working" });
});

router.use("/policies", policiesRoutes);
router.use("/categories", categoryRoutes);

router.use("/cart", cartRoutes);
router.use(authMiddleware);

router.use("/orders", orderRoutes);
router.use("/payment", paymentRoutes);
router.use("/address", addressRoutes);

module.exports = router;
