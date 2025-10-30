const express = require("express");
const { OrderController } = require("../../controllers");
const {
  OrderService,
  AddressService,
  UserService,
  CartService,
  FranchiseService,
  ShipmentService,
  CouponService
} = require("../../services");

const router = express.Router();
const orderService = new OrderService();
const addressService = new AddressService();
const userService = new UserService();
const cartService = new CartService();
const franchiseService = new FranchiseService();
const shipmentService = new ShipmentService();
const couponService = new CouponService();

const orderController = new OrderController({
  orderService,
  addressService,
  userService,
  cartService,
  franchiseService,
  shipmentService,
  couponService
});

router.get("/", (req, res, next) => orderController.getOrders(req, res, next));

router.get("/all", (req, res, next) =>
  orderController.getAllOrders(req, res, next)
);

router.post("/create", (req, res, next) =>
  orderController.createOrder(req, res, next)
);

router.get("/tracking/:orderId?", (req, res, next) =>
  orderController.getTracking(req, res, next)
);

module.exports = router;
