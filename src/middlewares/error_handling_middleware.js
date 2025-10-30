const errorHandlingMiddleware = (err, req, res, next) => {
  console.error(err); 

  const statusCode = res.statusCode === 200 ? (err.statusCode || 500) : res.statusCode;

  res.status(statusCode);

  res.json({
    success: false,
    message: err.message || "Internal Server Error",
    details: err.details || null, 
  });
};

module.exports = errorHandlingMiddleware;
