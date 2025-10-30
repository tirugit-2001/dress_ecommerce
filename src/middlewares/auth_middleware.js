const admin = require("firebase-admin");

const authMiddleware = async (req, res, next) => {

  const authorizationHeader = req.headers.authorization;
  if (req.path === "/health") {
    return next();
  }
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.sendError({
      message: "No token provided or incorrect format",
      statusCode: 401,
    });
  }

  const idToken = authorizationHeader.split("Bearer ")[1];

  if (!idToken) {
    return res.sendError({
      message: "Token is missing",
      statusCode: 401,
    });
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

    return res.sendError({
      message: "Invalid token",
      statusCode: 403,
    });
  }
};

module.exports = authMiddleware;
