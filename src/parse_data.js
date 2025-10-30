const { firebaseConfig } = require("./config");
const { ProductService } = require("./services");
const { firestore } = firebaseConfig;
const { COLLECTIONS } = require("./constants");

const fetchAllOrders = async () => {
  const allOrders = await firestore.collection(COLLECTIONS.ORDERS).get();
  return allOrders.docs.map((doc) => doc.data());
};

const fetchAllUserIds = async () => {
  const allUsers = await firestore.collection(COLLECTIONS.USERS).get();
  return allUsers.docs.map((doc) => doc.id);
};

const fetchUserById = async (userId) => {
  const user = await firestore.collection(COLLECTIONS.USERS).doc(userId).get();
  return user.data();
};

const fetchAllProducts = async () => {
  const allProducts = await firestore.collection(COLLECTIONS.PRODUCTS).get();
  return allProducts.docs.map((doc) => doc.data());
};

const fetchCartByUserId = async (userId) => {
  const cart = await firestore
    .collection(COLLECTIONS.USERS)
    .doc(userId)
    .collection(COLLECTIONS.CART)
    .get();
  return { userId, cart: cart.docs.map((doc) => doc.data()) };
};

const fetchAddressById = async ({ userId, addressId }) => {
  const address = await firestore
    .collection(COLLECTIONS.USERS)
    .doc(userId)
    .collection(COLLECTIONS.ADDRESS)
    .doc(addressId)
    .get();
  return address.data();
};

const updateOrder = async (order) => {
  await firestore
    .collection(COLLECTIONS.ORDERS)
    .doc(order.orderId)
    .update(order);
};

const updateProduct = async (product) => {
  await firestore
    .collection(COLLECTIONS.PRODUCTS)
    .doc(product.id)
    .update(product);
};

const updateOrderBookType = async (order) => {
  await firestore.collection(COLLECTIONS.ORDERS).doc(order.orderId).set(order);
};

const updateCartItemBookType = async (userId, cartItem) => {
  await firestore
    .collection(COLLECTIONS.USERS)
    .doc(userId)
    .collection(COLLECTIONS.CART)
    .doc(cartItem.id)
    .set(cartItem);
};

const parseOrders = async () => {
  const allOrders = await fetchAllOrders();

  for (const order of allOrders) {
    // let {
    //   billingAddressId,
    //   billingAddress,
    //   shippingAddressId,
    //   shippingAddress,
    //   userId,
    //   user,
    // } = order;
    // if (!userId) {
    //   userId = order.userRef._path.segments[1];
    // }
    // if (!user) {
    //   user = await fetchUserById(userId);
    // }
    // if (!billingAddress) {
    //   billingAddress = await fetchAddressById({
    //     userId,
    //     addressId: billingAddressId,
    //   });
    // }
    // if (!shippingAddress) {
    //   shippingAddress = await fetchAddressById({
    //     userId,
    //     addressId: shippingAddressId,
    //   });
    // }
    // order.billingAddress = billingAddress;
    // order.shippingAddress = shippingAddress;
    // order.user = user;

    const updatedOrder = {
      ...order,
      categories: ["H8SZ4VfsFXa4C9cUeonB"],
    };
    delete updatedOrder.categoryId;

    updateOrder(updatedOrder);
  }
};

const parseOrdersBookType = async () => {
  const allOrders = await fetchAllOrders();
  const updatePromises = allOrders.map((order) => {
    try {
      // order.bookType = order.subcategory || order.bookType || "notebook";
      order.categoryId = "H8SZ4VfsFXa4C9cUeonB";
      let subcategoryId;
      if (order.bookType === "notebook") {
        subcategoryId = "8kbDmqgCtRO2YzfwGgXa";
      } else if (order.bookType === "alphabetBook") {
        subcategoryId = "pglGSgziUYySxQvM3625";
      } else {
        subcategoryId = "5uIJMVTXmRPATfKNLAHJ";
      }
      order.subcategoryId = subcategoryId;
      return updateOrderBookType(order);
    } catch (e) {
      console.log(e);
    }
  });

  await Promise.all(updatePromises);
};

const parseOrdersItemsBookType = async () => {
  const allOrders = await fetchAllOrders();
  const updatePromises = allOrders.map((order) => {
    try {
      if (order.items && Array.isArray(order.items)) {
        order.items = order.items.map((item) => {
          item.bookType = item.subcategory || item.bookType || "notebook";
          delete item.subcategory;
          return item;
        });
      }
      return updateOrderBookType(order);
    } catch (e) {
      console.log(e);
    }
  });

  await Promise.all(updatePromises);
};

const parseCartItemsBookType = async () => {
  const allUserIds = await fetchAllUserIds();
  const cartPromises = allUserIds.map(async (userId) => {
    try {
      return await fetchCartByUserId(userId);
    } catch (e) {
      console.log(e);
    }
  });

  const cartData = await Promise.all(cartPromises);

  const updatePromises = cartData.map(async (data) => {
    try {
      var { userId, cart } = data;
      if (cart && Array.isArray(cart)) {
        const cartPromises = cart.map((item) => {
          item.bookType = item.subcategory || item.bookType || "notebook";
          delete item.subcategory;
          return updateCartItemBookType(userId, item);
        });
        return Promise.all(cartPromises);
      }
    } catch (e) {
      console.log(e);
    }
  });

  await mise.all(updatePromises);
};

const parseProducts = async () => {
  const allProducts = await fetchAllProducts();
  const updatePromises = allProducts.map((product) => {
    product.isActive = true;
    return updateProduct(product);
  });
  await Promise.all(updatePromises);
};

const deleteAllCartItems = async () => {
  try {
    const allUserIds = await fetchAllUserIds();
    console.log(`Found ${allUserIds.length} users`);

    for (const userId of allUserIds) {
      const cartSnapshot = await firestore
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .collection(COLLECTIONS.CART)
        .get();

      if (!cartSnapshot.empty) {
        const batch = firestore.batch();
        cartSnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        console.log(
          `Deleted ${cartSnapshot.size} cart items for user ${userId}`
        );
      }
    }

    console.log("Successfully deleted all cart items");
  } catch (error) {
    console.error("Error deleting cart items:", error);
    throw error;
  }
};

//TODO: change subcategoryId to categoryId and add book subcategory

const fetchFeaturedProducts = async () => {
  const productService = new ProductService();
  const featuredProducts = await productService.getFeaturedProducts({
    categoryId: "H8SZ4VfsFXa4C9cUeonB",
    limit: 200,
  });
  const allProducts = await fetchAllProducts();
  const featuredProductIds = featuredProducts.map((product) => product.id);
  const updatePromises = allProducts.map((product) => {
    product.isFeatured = featuredProductIds.includes(product.id);
    return updateProduct(product);
  });
  await Promise.all(updatePromises);
};

// fetchFeaturedProducts();

// parseProducts();
