class BannerController {
  constructor({ bannerService }) {
    this.bannerService = bannerService;
  }

  async createBanner(req, res, next) {
    try {
      const banner = await this.bannerService.createBanner(req.body);

      res.sendSuccess({
        data: banner,
        message: "Banner added successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async updateBannerOrders(req, res, next) {
    try {
      const { categoryId } = req.params;
      const { orderUpdates } = req.body;
      const banner = await this.bannerService.updateBannerOrders({
        categoryId,
        orderUpdates,
      });

      res.sendSuccess({
        data: banner,
        message: "Banners updated successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getBannersByCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const banners = await this.bannerService.getBannersByCategory(categoryId);
      res.sendSuccess({
        data: banners,
        message: "Banners fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async updateBanner(req, res, next) {
    try {
      const { categoryId, bannerId } = req.params;
      const { isActive } = req.body;
      await this.bannerService.updateBanner({
        bannerId,
        categoryId,
        isActive,
      });
      res.sendSuccess({
        message: "Banner status updated successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }
}

module.exports = BannerController;
