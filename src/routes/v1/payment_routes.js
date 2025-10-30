const express = require("express");
const { PaymentController } = require("../../controllers");
const {
  OrderService,
  PaymentService,
  ShipmentService,
  AddressService,
  FranchiseService,
  TransactionService,
  WhatsappService,
} = require("../../services");

const router = express.Router();
const orderService = new OrderService();
const paymentService = new PaymentService();
const shipmentService = new ShipmentService();
const addressService = new AddressService();
const franchiseService = new FranchiseService();
const transactionService = new TransactionService();
const whatsappService = new WhatsappService();

const paymentController = new PaymentController({
  paymentService,
  orderService,
  transactionService,
  franchiseService,
  shipmentService,
  addressService,
  whatsappService,
});

// Route to create an order
router.patch("/verify", (req, res, next) =>
  paymentController.verifyPayment(req, res, next)
);

module.exports = router;
