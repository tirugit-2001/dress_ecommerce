class IllustrationController {
  constructor({ categoryService, illustrationService }) {
    this.categoryService = categoryService;
    this.illustrationService = illustrationService;
  }

  async addIllustration(req, res, next) {
    try {
      const { categoryId } = req.params;
      const { imageUrl } = req.body;

      if (!categoryId) {
        return res.sendError({
          statusCode: 400,
          message: "Category ID is required",
        });
      }

      if (!imageUrl) {
        return res.sendError({
          statusCode: 400,
          message: "Image URL is required",
        });
      }

      const category = await this.categoryService.getCategoryById({
        categoryId,
      });

      if (!category) {
        return res.sendError({
          statusCode: 404,
          message: "Category not found",
        });
      }

      const illustrationId = await this.illustrationService.addIllustration({
        categoryId,
        imageUrl,
      });

      return res.sendSuccess({
        data: illustrationId,
        message: "Illustration added successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getIllustrationsByCategoryId(req, res, next) {
    try {
      const { categoryId } = req.params;

      if (!categoryId) {
        return res.sendError({
          statusCode: 400,
          message: "Category ID is required",
        });
      }

      const category = await this.categoryService.getCategoryById({
        categoryId,
      });

      if (!category) {
        return res.sendError({
          statusCode: 404,
          message: "Category not found",
        });
      }

      const illustrations =
        await this.illustrationService.getIllustrationsByCategoryId({
          categoryId,
        });

      return res.sendSuccess({
        data: illustrations,
        message: "Illustrations fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }
}

module.exports = IllustrationController;
