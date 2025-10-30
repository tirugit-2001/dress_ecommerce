const express = require("express");
const { AddressController } = require("../../controllers");
const { AddressService } = require("../../services");

const router = express.Router();
const addressService = new AddressService();

const addressController = new AddressController({
  addressService,
});
router.get("/all", (req, res, next) =>
  addressController.getAddresses(req, res, next)
);

router.get("/", (req, res, next) =>
  addressController.getAddressById(req, res, next)
);

router.put("/", (req, res, next) =>
  addressController.addAddress(req, res, next)
);

router.patch("/", (req, res, next) =>
  addressController.editAddress(req, res, next)
);

router.delete("/", (req, res, next) =>
  addressController.deleteAddress(req, res, next)
);

router.patch("/changeDefaultAddress", (req, res, next) =>
  addressController.changeDefaultAddress(req, res, next)
);

module.exports = router;
