class GiftRewardController {
  constructor({ giftRewardService }) { 
    this.giftRewardService = giftRewardService;
  }

  async create(req, res, next) { 
    try {
      const data = req.body;
      const newReward = await this.giftRewardService.createGiftReward(data);
      return res.sendSuccess({
        data: newReward,
        message: "Gift Reward created successfully",
      });
    } catch (error) {
      console.error("Error creating gift reward:", error);
      next(error, res);
    }
  }

  async getAll(req, res, next) { 
    try {
      const rewards = await this.giftRewardService.getAllGiftRewards();
      return res.sendSuccess({
        data: rewards,
        message: "Gift Rewards fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching all gift rewards:", error);
      next(error, res);
    }
  }

  async getById(req, res, next) { 
    try {
      const reward = await this.giftRewardService.getGiftRewardById(req.params.id);
      return res.sendSuccess({
        data: reward,
        message: "Gift Reward fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching gift reward by ID:", error);
      next(error, res);
    }
  }

  async update(req, res, next) { 
    try {
      const updatedReward = await this.giftRewardService.updateGiftReward(
        req.params.id,
        req.body
      );
      return res.sendSuccess({
        data: updatedReward,
        message: "Gift Reward updated successfully",
      });
    } catch (error) {
      console.error("Error updating gift reward:", error);
      next(error, res);
    }
  }

  async delete(req, res, next) { 
    try {
      await this.giftRewardService.deleteGiftReward(req.params.id);
      return res.sendSuccess({
        message: "Gift Reward deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting gift reward:", error);
      next(error, res);
    }
  }
}

module.exports = GiftRewardController;