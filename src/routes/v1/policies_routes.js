const express = require("express");
const { PoliciesService } = require("../../services");
const { PoliciesController } = require("../../controllers");

const router = express.Router();
const policiesService = new PoliciesService();

const policiesController = new PoliciesController({
  policiesService,
});

router.get("/", (req, res) =>
  res.sendError({
    statusCode: 400,
    message: "No policy type provided",
  })
);

router.get("/about-us", (req, res, next) =>
  policiesController.getAboutUsData(req, res, next)
);

router.get("/privacy-policy", (req, res, next) =>
  policiesController.getPrivacyPolicyData(req, res, next)
);

router.get("/shipping-policy", (req, res, next) =>
  policiesController.getShippingPolicyData(req, res, next)
);

router.get("/refund-policy", (req, res, next) =>
  policiesController.getRefundPolicyData(req, res, next)
);

router.get("/terms-and-conditions", (req, res, next) =>
  policiesController.getTermsAndConditionData(req, res, next)
);

router.get("/:policyType", (req, res) =>
  res.sendError({
    statusCode: 400,
    message: "Invalid policy type",
  })
);

module.exports = router;
