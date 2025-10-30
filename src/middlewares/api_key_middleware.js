const apiKeyMiddleware = (req, res, next) => {
  // Skip API key check for policies endpoint
  if (req.path.startsWith("/v1/policies")) {
    return next();
  }

  const apiKey = req.headers["x-api-key"];
  const validApiKey = process.env.API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    return res.sendError({
      message: "Invalid API key",
      statusCode: 401,
    });
  }

  next();
};

module.exports = apiKeyMiddleware;
