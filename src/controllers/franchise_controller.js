const { TRANSACTION_TYPE } = require("../constants");

class FranchiseController {
  constructor({ franchiseService, transactionService }) {
    this.franchiseService = franchiseService;
    this.transactionService = transactionService;
  }

  async create(req, res, next) {
    try {
      const franchise = await this.franchiseService.createFranchise(req.body);
      return res.sendSuccess({
        data: franchise,
        message: "Franchise added successfully",
      });
    } catch (error) {
      return next(error, res);
    }
  }

  async getAll(req, res, next) {
    try {
      const franchises = await this.franchiseService.getAllFranchises();
      if (!franchises || franchises.length === 0) {
        return res.sendError({
          statusCode: 204,
          message: "No franchise found",
        });
      }
      return res.sendSuccess({
        data: franchises,
        message: "Franchises fetched successfully",
      });
    } catch (error) {
      return next(error, res);
    }
  }

  async getById(req, res, next) {
    try {
      const franchise = await this.franchiseService.getFranchiseById(
        req.params.id
      );
      return res.sendSuccess({
        data: franchise,
        message: "Franchise fetched successfully",
      });
    } catch (error) {
      return next(error, res);
    }
  }

  async update(req, res, next) {
    try {
      const updatedFranchise = await this.franchiseService.updateFranchise(
        req.params.id,
        req.body
      );
      return res.sendSuccess({
        data: updatedFranchise,
        message: "Franchise updated successfully",
      });
    } catch (error) {
      return next(error, res);
    }
  }

  async settle(req, res, next) {
    try {
      const { id: franchiseId } = req.params;
      const { amount } = req.body;

      await Promise.all([
        this.franchiseService.settleUnsettledCommission(franchiseId, amount),
        this.transactionService.createTransaction(franchiseId, {
          franchiseId,
          amount,
          type: TRANSACTION_TYPE.SETTLEMENT,
        }),
      ]);
      return res.sendSuccess({
        message: "Franchise amount settled successfully",
      });
    } catch (error) {
      return next(error, res);
    }
  }

  async getDiscount(req, res, next) {
    try {
      const { couponCode } = req.query;
      if (!couponCode) {
        return res.sendError({ message: "Coupon code is required" });
      }
      const franchise = await this.franchiseService.getFranchiseByCouponCode(
        couponCode
      );
      if (!franchise) {
        return res.sendError({ message: "Invalid coupon code" });
      }

      const { discount, address, id, name, createdAt } = franchise;

      return res.sendSuccess({
        data: { discount, address, id, name, createdAt, couponCode },
        message: "Franchise discount fetched successfully",
      });
    } catch (error) {
      return next(error, res);
    }
  }

  async delete(req, res, next) {
    try {
      await this.franchiseService.deleteFranchise(req.params.id);
      return res.sendSuccess({
        message: "Franchise deleted successfully",
      });
    } catch (error) {
      return next(error, res);
    }
  }
}

module.exports = FranchiseController;
