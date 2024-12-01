// src/validators/media-validator.js
import {body} from 'express-validator';

/**
 * @apiDefine MediaValidation
 * @apiError (400) ValidationError Validation failed.
 */
const mediaValidationRules = () => {
  return [
    body('title')
      .isLength({min: 1})
      .withMessage('Title is required')
      .trim()
      .escape(),
    body('description').optional().trim().escape(),
    body('file').custom((value, {req}) => {
      if (!req.file) {
        throw new Error('File is required');
      }
      return true;
    }),
  ];
};

export default mediaValidationRules;
