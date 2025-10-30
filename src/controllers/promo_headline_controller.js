class PromoHeadlineController {

  constructor({ promoHeadlineService }) {
    this.promoHeadlineService = promoHeadlineService;
  }

  async createHeadline(req, res, next) { 
    try {
      const headline = await this.promoHeadlineService.createHeadline(req.body);
      return res.sendSuccess({
        data: headline,
        message: "Promo Headline created successfully",
      });
    } catch (error) {
      console.error("Error creating promo headline:", error);
      next(error, res); 
    }
  }

  async getHeadlineById(req, res, next) { 
    try {
      const headline = await this.promoHeadlineService.getHeadlineById(req.params.id);
      if (!headline) {
        return res.sendError({ message: "Promo Headline not found.", statusCode: 404 });
      }
      return res.sendSuccess({ 
        data: headline,
        message: "Promo Headline fetched successfully",
      });
    } catch (error) {
      console.error("Error getting promo headline by ID:", error);
      next(error, res);
    }
  }

  async getAllHeadlines(req, res, next) { 
    try {
      const headlines = await this.promoHeadlineService.getAllHeadlines();
      return res.sendSuccess({ 
        data: headlines,
        message: "Promo Headlines fetched successfully",
      });
    } catch (error) {
      console.error("Error getting all promo headlines:", error);
      next(error, res); 
    }
  }

  async updateHeadline(req, res, next) {
    try {
      const updatedHeadline = await this.promoHeadlineService.updateHeadline(
        req.params.id,
        req.body
      );
      return res.sendSuccess({ 
        data: updatedHeadline, 
        message: "Promo Headline updated successfully",
      });
    } catch (error) {
      console.error("Error updating promo headline:", error);
      next(error, res); 
    }
  }

  async deleteHeadline(req, res, next) { 
    try {
      const result = await this.promoHeadlineService.deleteHeadline(req.params.id);
      return res.sendSuccess({ 
        message: result.message || "Promo Headline deleted successfully", 
      });
    } catch (error) {
      console.error("Error deleting promo headline:", error);
      next(error, res); 
    }
  }

  // if in query it will be ?latest=true , then this endpoint will return latest only 1 active headline and 
  // for all other cases it will return all active endpoints
  async getActiveHeadlines(req, res, next) {
    try {
      const limitToOne = req.query.latest === 'true'; 

      const activeHeadlines = await this.promoHeadlineService.getActiveHeadlines(limitToOne);

      if (limitToOne) {
        if (activeHeadlines.length === 0) {
          return res.sendSuccess({
            data: null, 
            message: "No active promo headline found.",
          });
        }

        return res.sendSuccess({
          data: activeHeadlines[0], 
          message: "Latest active promo headline fetched successfully",
        });
      } else {
        return res.sendSuccess({
          data: activeHeadlines,
          message: "All active Promo Headlines fetched successfully",
        });
      }
    } catch (error) {
      console.error("Error getting active promo headlines:", error);
      next(error, res); 
    }
  }
  
}

module.exports = PromoHeadlineController;