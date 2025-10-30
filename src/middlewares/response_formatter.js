const responseFormatter = (req, res, next) => {
  res.sendSuccess = ({
    data = null,
    message = "Data found",
    statusCode = 200,
    meta = null,
  } = {}) => {
    const response = {
      success: true,
      message,
      data,
    };
    if (meta) {
      response.meta = meta;
    }
    res.status(statusCode).json(response);
  };

  res.sendError = ({
    message = "An error occurred",
    statusCode = 400,
    details = null,
  } = {}) => {
    const response = {
      success: false,
      message,
    };
    if (details) {
      response.details = details;
    }
    res.status(statusCode).json(response);
  };

  next();
};

module.exports = responseFormatter;
