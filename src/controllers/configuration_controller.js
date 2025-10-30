class ConfigurationController {
  constructor({
    categoryService,
    productService,
    subCategoryService,
    configurationService,
  }) {
    this.categoryService = categoryService;
    this.productService = productService;
    this.subCategoryService = subCategoryService;
    this.configurationService = configurationService;
  }

  async createConfiguration(req, res, next) {
    try {
      const { categoryId } = req.params;
      const { label, value, options } = req.body;

      if (!categoryId || !label || !value || !options) {
        let missingFields = [];
        if (!categoryId) {
          missingFields.push("Category ID");
        }
        if (!label) {
          missingFields.push("Configuration label");
        }
        if (!value) {
          missingFields.push("Configuration value");
        }
        if (!options || options.length === 0) {
          missingFields.push("Configuration options");
        }

        return res.sendError({
          statusCode: 400,
          message: `Missing fields: ${missingFields.join(", ")}`,
        });
      }

      if (!options.every((option) => option.label && option.value)) {
        return res.sendError({
          statusCode: 400,
          message: "Each option must have both label and value",
        });
      }

      const data = {
        label,
        value,
        options,
      };

      const configuration = await this.configurationService.createConfiguration(
        {
          categoryId,
          data,
        }
      );

      return res.sendSuccess({
        data: configuration,
        message: "Configuration created successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async updateConfiguration(req, res, next) {
    try {
      const { categoryId, configurationId } = req.params;
      const { label, value, options } = req.body;

      if (!categoryId || !configurationId || !label || !value || !options) {
        let missingFields = [];
        if (!categoryId) {
          missingFields.push("Category ID");
        }
        if (!configurationId) {
          missingFields.push("Configuration ID");
        }
        if (!label) {
          missingFields.push("Configuration label");
        }
        if (!value) {
          missingFields.push("Configuration value");
        }
        if (!options) {
          missingFields.push("Configuration options");
        }

        return res.sendError({
          statusCode: 400,
          message: `Missing fields: ${missingFields.join(", ")}`,
        });
      }

      if (!options.every((option) => option.label && option.value)) {
        return res.sendError({
          statusCode: 400,
          message: "Each option must have both label and value",
        });
      }

      const data = {
        label,
        value,
        options,
      };

      const configuration = await this.configurationService.updateConfiguration(
        {
          categoryId,
          configurationId,
          data,
        }
      );

      return res.sendSuccess({
        data: configuration,
        message: "Configuration updated successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getConfigurationsByCategoryId(req, res, next) {
    try {
      const { categoryId } = req.params;

      if (!categoryId) {
        return res.sendError({
          statusCode: 400,
          message: "Category ID is required",
        });
      }

      const configurations =
        await this.configurationService.getConfigurationsByCategoryId(
          categoryId
        );

      return res.sendSuccess({
        data: configurations,
        message: "Configurations fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getConfigurationById(req, res, next) {
    try {
      const { categoryId, configurationId } = req.params;

      if (!categoryId || !configurationId) {
        if (!categoryId) {
          missingFields.push("Category ID");
        }
        if (!configurationId) {
          missingFields.push("Configuration ID");
        }

        return res.sendError({
          statusCode: 400,
          message: `Missing fields: ${missingFields.join(", ")}`,
        });
      }

      const configuration =
        await this.configurationService.getConfigurationById({
          categoryId,
          configurationId,
        });

      return res.sendSuccess({
        data: configuration,
        message: "Configuration fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async deleteConfigurationOption(req, res, next) {
    try {
      const { categoryId, configurationId } = req.params;
      const { option } = req.body;

      if (!categoryId || !configurationId || !option) {
        let missingFields = [];
        if (!categoryId) {
          missingFields.push("Category ID");
        }
        if (!configurationId) {
          missingFields.push("Configuration ID");
        }
        if (!option) {
          missingFields.push("Option value");
        }

        return res.sendError({
          statusCode: 400,
          message: `Missing fields: ${missingFields.join(", ")}`,
        });
      }

      const configuration =
        await this.configurationService.getConfigurationById({
          categoryId,
          configurationId,
        });

      if (!configuration) {
        return res.sendError({
          statusCode: 404,
          message: "Configuration not found",
        });
      }

      const subcategoriesWithOption =
        await this.subCategoryService.getSubcategoriesWithOption({
          categoryId,
          option: configuration.value,
        });

      if (subcategoriesWithOption.length === 0) {
        configuration.options = configuration.options.filter(
          (element) => element.value !== option
        );
        await this.configurationService.updateConfiguration({
          categoryId,
          configurationId,
          data: configuration,
        });
        return res.sendSuccess({
          data: {},
          message: `${configuration.label} ${option} is removed`,
        });
      }

      const productsWithOption = (
        await Promise.all(
          subcategoriesWithOption.map(
            async (subcategory) =>
              await this.productService.getProductsByOption({
                categoryId,
                subcategoryId: subcategory.id,
                value: configuration.value,
                option,
              })
          )
        )
      ).flat();

      if (productsWithOption.length !== 0) {
        return res.sendError({
          statusCode: 400,
          message: `${configuration.label} ${option} is used in products`,
        });
      }

      configuration.options = configuration.options.filter(
        (element) => element.value !== option
      );
      await this.configurationService.updateConfiguration({
        categoryId,
        configurationId,
        data: configuration,
      });

      return res.sendSuccess({
        data: {},
        message: `${configuration.label} ${option} is removed`,
      });
    } catch (error) {
      next(error, res);
    }
  }
}

module.exports = ConfigurationController;
