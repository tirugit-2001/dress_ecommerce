const express = require("express");
const helmet = require("helmet");
const {
  loggerMiddleware,
  responseFormatter,
  errorHandlingMiddleware,
  rateLimiter,
  apiKeyMiddleware,
} = require("./middlewares");
const cors = require("cors");
const apiRoutes = require("./routes");

const app = express();

app.use(helmet());

app.use(cors());

app.use(responseFormatter);

// Rate limiting
app.use(rateLimiter);

app.get("/", (req, res) => {
  res.sendSuccess({ message: "Server is running" });
});

app.get("/health", (req, res) => {
  res.sendSuccess({ message: "Server is healthy" });
});

app.use(apiKeyMiddleware);

app.use(express.json({ limit: "10kb" }));

app.use(loggerMiddleware);

// API Routes with /api prefix and versioning
app.use(apiRoutes);


// Unknown route handling middleware
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});


// Error handling middleware (must be after the routes)
app.use(errorHandlingMiddleware);

module.exports = app;
