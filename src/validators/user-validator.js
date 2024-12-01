// src/validators/user-validator.js
import {body} from 'express-validator';

/**
 * @apiDefine UserValidation
 * @apiError (400) ValidationError Validation failed.
 */
const userValidationRules = () => {
  return [
    body('username')
      .isLength({min: 3})
      .withMessage('Username must be at least 3 characters')
      .trim()
      .escape(),
    body('password')
      .isLength({min: 6})
      .withMessage('Password must be at least 6 characters')
      .trim(),
    body('email')
      .isEmail()
      .withMessage('Invalid email address')
      .normalizeEmail(),
    body('user_level_id')
      .isInt({min: 1, max: 2})
      .withMessage('User level must be 1 or 2'),
  ];
};

export default userValidationRules;
