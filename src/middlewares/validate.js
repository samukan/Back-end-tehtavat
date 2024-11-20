// src/middlewares/validate.js
import {validationResult} from 'express-validator';

const validate = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      const error = new Error('Validation failed');
      error.status = 400;
      error.details = errors.array();
      return next(error);
    }
    next();
  } catch (err) {
    console.error('Error in validate middleware:', err);
    next(err);
  }
};

export default validate;
