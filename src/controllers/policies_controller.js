class PoliciesController {
  constructor({ policiesService }) {
    this.policiesService = policiesService;
  }

  async getAboutUsData(req, res, next) {
    try {
      const aboutUsData = await this.policiesService.getAboutUsData();

      if (!aboutUsData || Object.keys(aboutUsData).length === 0) {
        return res.sendError({
          statusCode: 404,
          message: "No About Us data found",
        });
      }

      res.sendSuccess({
        data: aboutUsData,
        message: "About Us data fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getPrivacyPolicyData(req, res, next) {
    try {
      const privacyPolicyData =
        await this.policiesService.getPrivacyPolicyData();

      if (!privacyPolicyData || Object.keys(privacyPolicyData).length === 0) {
        return res.sendError({
          statusCode: 404,
          message: "No Privacy Policy data found",
        });
      }

      res.sendSuccess({
        data: privacyPolicyData,
        message: "Privacy Policy data fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getShippingPolicyData(req, res, next) {
    try {
      const shippingPolicyData =
        await this.policiesService.getShippingPolicyData();

      if (!shippingPolicyData || Object.keys(shippingPolicyData).length === 0) {
        return res.sendError({
          statusCode: 404,
          message: "No Shipping Policy data found",
        });
      }

      res.sendSuccess({
        data: shippingPolicyData,
        message: "Shipping Policy data fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getRefundPolicyData(req, res, next) {
    try {
      const refundPolicyData = await this.policiesService.getRefundPolicyData();

      if (!refundPolicyData || Object.keys(refundPolicyData).length === 0) {
        return res.sendError({
          statusCode: 404,
          message: "No Refund Policy data found",
        });
      }

      res.sendSuccess({
        data: refundPolicyData,
        message: "Refund Policy data fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getTermsAndConditionData(req, res, next) {
    try {
      const termsAndConditionData =
        await this.policiesService.getTermsAndConditionData();

      if (
        !termsAndConditionData ||
        Object.keys(termsAndConditionData).length === 0
      ) {
        return res.sendError({
          statusCode: 404,
          message: "No Terms and Conditions data found",
        });
      }

      res.sendSuccess({
        data: termsAndConditionData,
        message: "Terms and Conditions data fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }
}

module.exports = PoliciesController;
