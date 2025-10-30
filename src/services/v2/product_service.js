const { firebaseConfig } = require("../../config");
const { firestore } = firebaseConfig;
const { COLLECTIONS } = require("../../constants");
const { Product } = require("../../modelClasses");

class ProductService {
  constructor() {
    this.db = firestore;
    this.collection = COLLECTIONS.PRODUCTS;
  }

  async createProduct(productData) {
    try {
      const batch = this.db.batch();
      let productModel = new Product(productData);

      const product = await this.db
        .collection(this.collection)
        .add(productModel.toFirestore());

      this.db.collection(this.collection).doc(product.id).update({
        id: product.id,
      });
      await batch.commit();

      return product.id;
    } catch (error) {
      throw new Error("Failed to create product." + error);
    }
  }

  async getProductByIdentifier(identifier) {
    try {
      if (!identifier) {
        throw new Error("Product ID is required.");
      }

      const productDoc = await this.db
        .collection(this.collection)
        .doc(identifier)
        .get();

      if (productDoc.exists) {
        return Product.fromFirestore(productDoc);
      }

      const productSnapshot = await this.db
        .collection(this.collection)
        .where("slug", "==", identifier)
        .where("isActive", "==", true)
        .limit(1)
        .get();

      if (productSnapshot.empty) {
        return null;
      }

      const productBySlug = productSnapshot.docs[0];
      return Product.fromFirestore(productBySlug);
    } catch (error) {
      throw new Error("Failed to fetch product." + error);
    }
  }

  async updateProduct({ productId, updatedData }) {
    try {
      if (!productId || !updatedData) {
        throw new Error("Product ID and updated data are required.");
      }

      const productRef = this.db.collection(this.collection).doc(productId);
      const productDoc = await productRef.get();

      if (!productDoc.exists) {
        throw new Error("Product not found.");
      }

      await productRef.update(updatedData);
      return { success: true, message: "Product updated successfully." };
    } catch (error) {
      throw new Error("Failed to update product.", error);
    }
  }

  async getProducts({
    categoryId,
    subcategoryId,
    collectionId,
    limit = 20,
    page = 1,
  }) {
    try {
      let query = this.db
        .collection(this.collection)
        .where("isActive", "==", true);

      if (categoryId) {
        query = query.where("categoryId", "==", categoryId);
      }

      if (subcategoryId) {
        query = query.where("subcategoryId", "==", subcategoryId);
      }

      if (collectionId) {
        query = query.where("collectionIds", "array-contains", collectionId);
      }

      query = query.orderBy("createdAt", "desc");

      limit = Number.isInteger(limit) ? limit : parseInt(limit);
      page = Number.isInteger(page) ? page : parseInt(page);

      // Get total count before applying pagination
      // Get total count and paginated results in parallel
      const [totalSnapshot, productDocs] = await Promise.all([
        query.get(),
        query
          .limit(limit)
          .offset((page - 1) * limit)
          .get(),
      ]);
      const total = totalSnapshot.size;

      if (productDocs.empty) {
        return {
          products: [],
          pagination: {
            total: 0,
            page,
            limit,
          },
        };
      }

      const products = productDocs.docs.map((doc) =>
        Product.fromFirestore(doc)
      );

      return {
        products,
        pagination: {
          total,
          page,
          limit,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  async getNewArrivals({ categoryId, limit = 10 }) {
    try {
      const productDocs = await this.db
        .collection(this.collection)
        .where("isActive", "==", true)
        .where("categoryId", "==", categoryId)
        .where("isNewArrival", "==", true)
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();

      if (productDocs.empty) {
        return [];
      }

      const products = productDocs.docs.map((doc) =>
        Product.fromFirestore(doc)
      );

      return products;
    } catch (error) {
      throw new Error(`Failed to fetch new arrivals: ${error.message}`);
    }
  }

  async getBestSellers({ categoryId, limit = 10 }) {
    try {
      const productDocs = await this.db
        .collection(this.collection)
        .where("isActive", "==", true)
        .where("categoryId", "==", categoryId)
        .where("isBestSeller", "==", true)
        .limit(limit)
        .get();

      if (productDocs.empty) {
        return [];
      }

      const products = productDocs.docs.map((doc) =>
        Product.fromFirestore(doc)
      );

      return products;
    } catch (error) {
      throw new Error(`Failed to fetch best sellers: ${error.message}`);
    }
  }

  async getTopChoices({ categoryId, limit = 10 }) {
    try {
      const productDocs = await this.db
        .collection(this.collection)
        .where("isActive", "==", true)
        .where("categoryId", "==", categoryId)
        .where("isTopChoice", "==", true)
        .limit(limit)
        .get();

      if (productDocs.empty) {
        return [];
      }

      const products = productDocs.docs.map((doc) =>
        Product.fromFirestore(doc)
      );

      return products;
    } catch (error) {
      throw new Error(`Failed to fetch top choices: ${error.message}`);
    }
  }

  async getFeaturedProducts({ categoryId, limit = 20 }) {
    try {
      console.log("getFeaturedProducts categoryId", categoryId);

      const productDocs = await this.db
        .collection(this.collection)
        .where("isActive", "==", true)
        .where("categoryId", "==", categoryId)
        .where("isFeatured", "==", true)
        .limit(limit)
        .get();

      if (productDocs.empty) {
        return [];
      }

      const products = productDocs.docs.map((doc) =>
        Product.fromFirestore(doc)
      );

      return products;
    } catch (error) {
      throw new Error(`Failed to fetch featured products: ${error.message}`);
    }
  }

  // async getFeaturedProducts({ categoryId, limit = 20 }) {
  //   try {
  //     // Get a mix of all featured product types
  //     const [newArrivals, bestSellers, topChoices] = await Promise.all([
  //       this.getNewArrivals({ categoryId, limit: limit / 2 }),
  //       this.getBestSellers({ categoryId, limit: limit / 2 }),
  //       this.getTopChoices({ categoryId, limit: limit / 2 }),
  //     ]);

  //     // Combine and deduplicate products (in case a product belongs to multiple categories)
  //     const productMap = new Map();

  //     [...newArrivals, ...bestSellers, ...topChoices].forEach((product) => {
  //       if (!productMap.has(product.id)) {
  //         productMap.set(product.id, product);
  //       }
  //     });

  //     // Convert map back to array and limit to requested size
  //     const featuredProducts = Array.from(productMap.values()).slice(0, limit);

  //     return featuredProducts;
  //   } catch (error) {
  //     throw new Error(`Failed to fetch featured products: ${error.message}`);
  //   }
  // }

  async getAllProducts() {
    const productDocs = await this.db
      .collection(this.collection)
      .orderBy("createdAt", "desc")
      .get();
    return productDocs.docs.map((doc) => Product.fromFirestore(doc));
  }

  async getProductsByField({ categoryId, subcategoryId, value }) {
    const productsData = await this.getProducts({
      categoryId,
      subcategoryId,
      limit: 20,
      page: 1,
    });
    const products = productsData.products;
    const productsWithValue = products.filter((product) => {
      return (product.configuration ?? []).some((configuration) => {
        return configuration.value === value;
      });
    });

    return productsWithValue;
  }

  async getProductsByOption({ categoryId, subcategoryId, value, option }) {
    const productsWithValue = await this.getProductsByField({
      categoryId,
      subcategoryId,
      value,
    });

    const productsWithOption = productsWithValue.filter((product) =>
      product.configuration.some((field) => {
        return field.options.some((element) => element.value === option);
      })
    );

    return productsWithOption;
  }

  async getRelatedProducts({ identifier, limit = 10 }) {
    try {
      const product = await this.getProductByIdentifier(identifier);

      if (!product) {
        return [];
      }

      let query = this.db
        .collection(this.collection)
        .where("categoryId", "==", product.categoryId)
        .where("isActive", "==", true)
        .where("id", "!=", product.id)
        .orderBy("createdAt", "desc");

      let relatedProducts = [];
      if (product.tags && product.tags.length > 0) {
        const tags = product.tags.slice(0, 30);
        const queryWithTags = query.where("tags", "array-contains-any", tags);
        const productsWithTags = await queryWithTags.limit(limit * 2).get();

        if (!productsWithTags.empty) {
          relatedProducts = productsWithTags.docs.map((doc) =>
            Product.fromFirestore(doc)
          );
        }
      }

      // If no products found with tags, try without tags
      if (relatedProducts.length < limit) {
        const productsQuery = await query.limit(limit * 2).get();
        if (!productsQuery.empty) {
          relatedProducts = productsQuery.docs.map((doc) =>
            Product.fromFirestore(doc)
          );
        }
      }

      if (relatedProducts.length === 0) {
        return [];
      }

      const scoredProducts = relatedProducts.map((relatedProduct) => {
        let score = 0;

        if (relatedProduct.subcategoryId === product.subcategoryId) {
          score += 5;
        }

        if (product.tags && relatedProduct.tags) {
          const matchingTags = product.tags.filter((tag) =>
            relatedProduct.tags.includes(tag)
          ).length;
          score += matchingTags;
        }

        if (product.configuration && relatedProduct.configuration) {
          const matchingConfigs = product.configuration.filter((config) =>
            relatedProduct.configuration.some(
              (relConfig) => relConfig.value === config.value
            )
          ).length;
          score += matchingConfigs;
        }

        if (product.price && relatedProduct.price) {
          const priceDiff = Math.abs(product.price - relatedProduct.price);
          if (priceDiff < 500) score += 2;
          else if (priceDiff < 1000) score += 1;
        }

        return { product: relatedProduct, score };
      });

      const sortedProducts = scoredProducts
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((item) => item.product);

      return sortedProducts;
    } catch (error) {
      throw new Error(`Failed to fetch related products: ${error.message}`);
    }
  }

  async updateProductFeaturedStatus(productId, featuredData) {
    try {
      const { isNewArrival, isBestSeller, isTopChoice } = featuredData;

      const productRef = this.db.collection(this.collection).doc(productId);
      const productDoc = await productRef.get();

      if (!productDoc.exists) {
        throw new Error(`Product with ID ${productId} not found.`);
      }

      const updateData = {};

      if (isNewArrival !== undefined) {
        updateData.isNewArrival = isNewArrival;
      }

      if (isBestSeller !== undefined) {
        updateData.isBestSeller = isBestSeller;
      }

      if (isTopChoice !== undefined) {
        updateData.isTopChoice = isTopChoice;
      }

      if (Object.keys(updateData).length === 0) {
        return productDoc.data();
      }

      await productRef.update(updateData);

      const updatedProductDoc = await productRef.get();
      return Product.fromFirestore(updatedProductDoc);
    } catch (error) {
      throw new Error(
        `Failed to update product featured status: ${error.message}`
      );
    }
  }

  async setNewArrivals(options = {}) {
    try {
      const { days = 30, limit = 20 } = options;

      // Calculate the date threshold for new arrivals (e.g., products added in the last 30 days)
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() - days);

      // Get recent products
      const recentProductsQuery = await this.db
        .collection(this.collection)
        .where("isActive", "==", true)
        .where("createdAt", ">=", firestore.Timestamp.fromDate(thresholdDate))
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();

      if (recentProductsQuery.empty) {
        return [];
      }

      // Update each product to mark it as a new arrival
      const batch = this.db.batch();
      recentProductsQuery.docs.forEach((doc) => {
        batch.update(doc.ref, { isNewArrival: true });
      });

      await batch.commit();

      return recentProductsQuery.docs.map((doc) => Product.fromFirestore(doc));
    } catch (error) {
      throw new Error(`Failed to set new arrivals: ${error.message}`);
    }
  }
}

module.exports = ProductService;
