const admin = require("firebase-admin");
const { firestore } = admin;

class Product {
  constructor({
    id,
    productImages,
    canvasImage,
    illustrationImage,
    isCustomizable,
    name,
    description,
    care,
    sku,
    slug,
    subtitle,
    tags,
    dimension,
    configuration,
    categoryId,
    subcategoryId,
    illustrationOption,
    presetText = "",
    basePrice,
    illustrationSize,
    discountedPrice,
    createdAt = new Date(),
    sizeChart,
    fontColor,
    fontFamily,
    fontSize,
    isFeatured = false,
    isNewArrival = false,
    isBestSeller = false,
    isTopChoice = false,
    isActive = true,
    collectionIds = [],
  }) {
    this.id = id;
    this.productImages = productImages;
    this.canvasImage = canvasImage || "";
    this.illustrationImage = illustrationImage || "";
    this.isCustomizable = isCustomizable ?? false;
    this.name = name;
    this.description = description;
    this.care = care || "";
    this.sku = sku;
    this.slug = slug;
    this.subtitle = subtitle;
    this.tags = tags;
    this.dimension =
      dimension instanceof Dimension ? dimension : new Dimension(dimension);
    this.configuration = Array.isArray(configuration)
      ? configuration.map((config) =>
          config instanceof Configuration ? config : new Configuration(config)
        )
      : [];
    this.categoryId = categoryId;
    this.subcategoryId = subcategoryId;
    this.illustrationOption = illustrationOption;
    this.presetText = presetText || "";
    this.basePrice = basePrice || 0;
    this.discountedPrice = discountedPrice || 0;
    this.createdAt =
      createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.sizeChart = sizeChart || "";
    this.illustrationSize = illustrationSize;
    this.fontColor = fontColor;
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
    this.isFeatured = isFeatured;
    this.isNewArrival = isNewArrival;
    this.isBestSeller = isBestSeller;
    this.isTopChoice = isTopChoice;
    this.isActive = isActive;
    this.collectionIds = collectionIds;
  }

  static fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    const dimension = data.dimension
      ? Dimension.fromFirestore(data.dimension)
      : new Dimension();
    const configuration = data.configuration
      ? data.configuration.map((config) => Configuration.fromFirestore(config))
      : [];

    return new Product({
      id: snapshot.id,
      productImages: data.productImages || [],
      canvasImage: data.canvasImage || "",
      illustrationImage: data.illustrationImage || "",
      isCustomizable: data.isCustomizable || false,
      name: data.name || "",
      description: data.description || "",
      care: data.care || "",
      sku: data.sku || "",
      slug: data.slug || "",
      tags: data.tags || [],
      subtitle: data.subtitle || "",
      dimension,
      configuration,
      categoryId: data.categoryId || "",
      subcategoryId: data.subcategoryId || "",
      illustrationOption: data.illustrationOption,
      presetText: data.presetText || "",
      basePrice: data.basePrice || 0,
      discountedPrice: data.discountedPrice || 0,
      createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
      sizeChart: data.sizeChart || "",
      illustrationSize: data.illustrationSize,
      fontColor: data.fontColor || "",
      fontFamily: data.fontFamily || "",
      fontSize: data.fontSize || 30,
      isFeatured: data.isFeatured || false,
      isNewArrival: data.isNewArrival || false,
      isBestSeller: data.isBestSeller || false,
      isTopChoice: data.isTopChoice || false,
      isActive: data.isActive || true,
      collectionIds: data.collectionIds || [],
    });
  }

  // Convert Product object to Firestore data
  toFirestore() {
    return {
      productImages: this.productImages,
      canvasImage: this.canvasImage,
      illustrationImage: this.illustrationImage,
      isCustomizable: this.isCustomizable,
      name: this.name,
      description: this.description,
      care: this.care,
      sku: this.sku,
      slug: this.slug,
      tags: this.tags,
      subtitle: this.subtitle,
      dimension:
        this.dimension instanceof Dimension
          ? this.dimension.toFirestore()
          : null,
      configuration: this.configuration.map((config) =>
        config instanceof Configuration ? config.toFirestore() : null
      ),
      categoryId: this.categoryId,
      subcategoryId: this.subcategoryId,
      illustrationOption: this.illustrationOption,
      presetText: this.presetText,
      basePrice: this.basePrice,
      discountedPrice: this.discountedPrice,
      createdAt: firestore.Timestamp.fromDate(this.createdAt),
      sizeChart: this.sizeChart,
      illustrationSize: this.illustrationSize,
      fontColor: this.fontColor,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      isFeatured: this.isFeatured,
      isNewArrival: this.isNewArrival,
      isBestSeller: this.isBestSeller,
      isTopChoice: this.isTopChoice,
      isActive: this.isActive,
      collectionIds: this.collectionIds,
    };
  }

  // Add method to create a copy with optional updates
  copyWith(updates = {}) {
    return new Product({
      id: updates.id ?? this.id,
      productImages: updates.productImages ?? this.productImages,
      canvasImage: updates.canvasImage ?? this.canvasImage,
      illustrationImage: updates.illustrationImage ?? this.illustrationImage,
      isCustomizable: updates.isCustomizable ?? this.isCustomizable,
      name: updates.name ?? this.name,
      description: updates.description ?? this.description,
      care: updates.care ?? this.care,
      sku: updates.sku ?? this.sku,
      slug: updates.slug ?? this.slug,
      subtitle: updates.subtitle ?? this.subtitle,
      tags: updates.tags ?? this.tags,
      dimension: updates.dimension ?? this.dimension,
      configuration: updates.configuration ?? this.configuration,
      categoryId: updates.categoryId ?? this.categoryId,
      subcategoryId: updates.subcategoryId ?? this.subcategoryId,
      illustrationOption: updates.illustrationOption ?? this.illustrationOption,
      presetText: updates.presetText ?? this.presetText,
      basePrice: updates.basePrice ?? this.basePrice,
      discountedPrice: updates.discountedPrice ?? this.discountedPrice,
      createdAt: updates.createdAt ?? this.createdAt,
      sizeChart: updates.sizeChart ?? this.sizeChart,
      illustrationSize: updates.illustrationSize ?? this.illustrationSize,
      fontColor: updates.fontColor ?? this.fontColor,
      fontFamily: updates.fontFamily ?? this.fontFamily,
      fontSize: updates.fontSize ?? this.fontSize,
      isFeatured: updates.isFeatured ?? this.isFeatured,
      isNewArrival: updates.isNewArrival ?? this.isNewArrival,
      isBestSeller: updates.isBestSeller ?? this.isBestSeller,
      isTopChoice: updates.isTopChoice ?? this.isTopChoice,
      isActive: updates.isActive ?? this.isActive,
      collectionIds: updates.collectionIds ?? this.collectionIds,
    });
  }
}

class Dimension {
  constructor({ height, width, length, weight }) {
    this.height = height || 0;
    this.width = width || 0;
    this.length = length || 0;
    this.weight = weight || 0;
  }

  // Convert Firestore data to Dimension object
  static fromFirestore(data) {
    return new Dimension({
      height: data.height,
      width: data.width,
      length: data.length,
      weight: data.weight,
    });
  }

  // Convert Dimension object to Firestore data
  toFirestore() {
    return {
      height: this.height,
      width: this.width,
      length: this.length,
      weight: this.weight,
    };
  }
}

// Configuration Class
class Configuration {
  constructor({ value, label, options }) {
    this.value = value || "";
    this.label = label || "";
    this.options = options || [];
  }

  // Convert Firestore data to Configuration object
  static fromFirestore(data) {
    return new Configuration({
      value: data.value,
      label: data.label,
      options: data.options,
    });
  }

  // Convert Configuration object to Firestore data
  toFirestore() {
    return {
      value: this.value,
      label: this.label,
      options: this.options,
    };
  }
}

module.exports = Product;
