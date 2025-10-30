const admin = require("firebase-admin");

const optionalAuthMiddleware = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return next();
  }

  const idToken = authorizationHeader.split("Bearer ")[1];

  if (!idToken) {
    return next();
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.userId = decodedToken.uid;
    req.user = decodedToken;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);

    if (error.code === "auth/id-token-expired") {
      return res.sendError({
        message: "Token has expired",
        statusCode: 401,
      });
    }

    next();
  }
};

module.exports = optionalAuthMiddleware;
