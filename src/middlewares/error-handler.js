// src/middlewares/error-handler.js

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  const response = {
    error: {
      message: message,
    },
  };

  if (err.details && err.details.length > 0) {
    response.error.details = err.details;
  }

  res.status(status).json(response);
};

export default errorHandler;
