// src/routes/media-router.js
import express from 'express';
import multer from 'multer';
import {
  getItemById,
  getItems,
  postItem,
  putItem,
  deleteItem,
} from '../controllers/media-controller.js';
import authenticateToken from '../middlewares/authentication.js';
import mediaValidationRules from '../validators/media-validator.js';
import validate from '../middlewares/validate.js';

const upload = multer({dest: 'uploads/'});

const mediaRouter = express.Router();

mediaRouter.route('/').get(getItems).post(
  authenticateToken,
  upload.single('file'), // Pidä tämä rivinä
  mediaValidationRules(),
  validate,
  postItem,
);

mediaRouter
  .route('/:id')
  .get(getItemById)
  .put(
    authenticateToken,
    upload.single('file'), // Lisää tämä, jos puuttuu
    mediaValidationRules(),
    validate,
    putItem,
  )
  .delete(authenticateToken, deleteItem);

export default mediaRouter;
