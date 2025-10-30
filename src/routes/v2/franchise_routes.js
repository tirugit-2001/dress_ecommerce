const express = require("express");
const { FranchiseController } = require("../../controllers");
const { FranchiseService, TransactionService } = require("../../services");

const router = express.Router();
const franchiseService = new FranchiseService();
const transactionService = new TransactionService();
const franchiseController = new FranchiseController({
  franchiseService,
  transactionService,
});

router.post("/", (req, res, next) =>
  franchiseController.create(req, res, next)
);

router.get("/", (req, res, next) => franchiseController.getAll(req, res, next));

router.get("/discount", (req, res, next) =>
  franchiseController.getDiscount(req, res, next)
);

router.get("/:id", (req, res, next) =>
  franchiseController.getById(req, res, next)
);

router.patch("/:id", (req, res, next) =>
  franchiseController.update(req, res, next)
);

router.patch("/:id/settle", (req, res, next) =>
  franchiseController.settle(req, res, next)
);

router.delete("/:id", (req, res, next) =>
  franchiseController.delete(req, res, next)
);

module.exports = router;
