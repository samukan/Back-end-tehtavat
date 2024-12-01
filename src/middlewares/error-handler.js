// src/middlewares/error-handler.js

const errorHandler = (err, req, res, next) => {
  // Tulosta virhepinon vain kehitysympäristössä
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

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

  // Lisää virhepino vastaukseen vain kehitysympäristössä
  if (process.env.NODE_ENV !== 'production') {
    response.error.stack = err.stack;
  }

  res.status(status).json(response);
};

export default errorHandler;
