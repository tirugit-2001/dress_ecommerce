class AddressController {
  constructor({ addressService }) {
    this.addressService = addressService;
  }

  async parseAddress(address) {
    if (Array.isArray(address)) {
      return address.map((addr) => ({
        ...addr,
        createdAt: addr.createdAt
          ? addr.createdAt.toDate()
          : new Date().toISOString(),
      }));
    }
    return {
      ...address,
      createdAt: address.createdAt
        ? address.createdAt.toDate()
        : new Date().toISOString(),
    };
  }

  async getAddressById(req, res, next) {
    try {
      const addressId = req.query.addressId;
      const userId = req.userId;

      if (!userId || !addressId) {
        return res.sendError({
          statusCode: 400,
          message: "User ID and Address ID are required",
        });
      }

      const address = await this.addressService.getAddressById({
        userId,
        addressId,
      });

      if (!address) {
        return res.sendError({
          statusCode: 404,
          message: "Address not found",
        });
      }

      res.sendSuccess({
        data: await this.parseAddress(address),
        message: "Address fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async getAddresses(req, res, next) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.sendError({
          statusCode: 400,
          message: "User ID is required",
        });
      }

      const addresses = await this.addressService.getAddresses(userId);

      if (!addresses || addresses.length === 0) {
        return res.sendError({
          statusCode: 404,
          message: "No addresses found for this user",
        });
      }

      res.sendSuccess({
        data: await this.parseAddress(addresses),
        message: "Addresses fetched successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async addAddress(req, res, next) {
    try {
      const userId = req.userId;
      const addressData = req.body;

      if (!userId || !addressData) {
        return res.sendError({
          statusCode: 400,
          message: "User ID and address data are required",
        });
      }

      const newAddress = await this.addressService.addAddress(
        userId,
        addressData
      );

      res.sendSuccess({
        data: await this.parseAddress(newAddress),
        message: "Address added successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async editAddress(req, res, next) {
    try {
      const addressId = req.query.addressId;
      const userId = req.userId;
      const updatedData = req.body;

      if (!userId || !addressId || !updatedData) {
        return res.sendError({
          statusCode: 400,
          message: "User ID, address ID, and updated data are required",
        });
      }

      const updatedAddress = await this.addressService.editAddress({
        userId,
        addressId,
        updatedData,
      });

      res.sendSuccess({
        data: await this.parseAddress(updatedAddress),
        message: "Address updated successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async deleteAddress(req, res, next) {
    try {
      const addressId = req.query.addressId;
      const userId = req.userId;

      if (!userId || !addressId) {
        return res.sendError({
          statusCode: 400,
          message: "User ID and address ID are required",
        });
      }

      await this.addressService.deleteAddress({ userId, addressId });

      res.sendSuccess({
        message: "Address deleted successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }

  async changeDefaultAddress(req, res, next) {
    try {
      const userId = req.userId;
      const { newDefaultAddressId } = req.body;

      if (!userId || !newDefaultAddressId) {
        return res.sendError({
          statusCode: 400,
          message: "User ID and new default address ID are required",
        });
      }

      await this.addressService.changeDefaultAddress(
        userId,
        newDefaultAddressId
      );

      res.sendSuccess({
        message: "Default address updated successfully",
      });
    } catch (error) {
      next(error, res);
    }
  }
}

module.exports = AddressController;
