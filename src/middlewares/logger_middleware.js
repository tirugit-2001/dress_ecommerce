const loggerMiddleware = (req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.method} ${req.originalUrl}`;
  console.log(log);
  next();
};

module.exports = loggerMiddleware;
