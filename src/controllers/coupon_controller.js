class CouponController {
  constructor({ couponService }) {
    this.couponService = couponService;
  }

  async create(req, res, next) {
    try {
      const data = req.body;
      const coupon = await this.couponService.createCoupon(data);

      return res.sendSuccess({
        data: coupon,
        message: "Coupon created successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getAll(req, res, next) {
    try {
      const coupons = await this.couponService.getAllCoupons();
      return res.sendSuccess({
        data: coupons,
        message: "Coupons fetched successfully",
      });
    } catch (err) {
      next(err,res);
    }
  }

  async getById(req, res, next) {
    try {
      const coupon = await this.couponService.getCouponById(req.params.id);
       return res.sendSuccess({
        data: coupon,
        message: "Coupon fetched successfully",
      });
    } catch (err) {
      next(err,res);
    }
  }

  async validate(req, res, next) {
    try {
      const { couponCode } = req.params;
      if (!couponCode) {
        return res.sendError({ message: "Coupon code is required" });
      }

      const coupon = await this.couponService.findCouponOrFranchise(couponCode);
      if (!coupon) {
        return res.sendError({ message: "Invalid coupon code", statusCode:400 });
      }

      if (coupon.error) {
        return res.sendError({ message: coupon.reason, statusCode:400 });
      }

      return res.sendSuccess({
        data: coupon,
        message: "Coupon is valid",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.couponService.deleteCoupon(id);

      return res.sendSuccess({
        message: "Coupon deleted successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async incrementUsedCount(req, res, next) {
    try {
      const { id } = req.params;
      await this.couponService.incrementUsedCount(id);

      return res.sendSuccess({
        message: "Coupon usage updated",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await this.couponService.updateCoupon(
        req.params.id,
        req.body
      );
      return res.sendSuccess({
        data: updated,
        message: "Coupon updated",
      });
    } catch (err) {
      next(err,res);
    }
  }
}

module.exports = CouponController;
