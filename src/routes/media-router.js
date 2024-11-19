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

// Määritä multerin tallennuspolku
const upload = multer({dest: 'uploads/'});

const mediaRouter = express.Router();

// Lisää upload.single('file') tiedoston lataamiseen
mediaRouter
  .route('/')
  .get(getItems)
  .post(
    authenticateToken, // Vain autentikoidut käyttäjät voivat ladata
    upload.single('file'),
    (req, res, next) => {
      // Loggaa body ja file täällä
      console.log('Multer processed req.body:', req.body);
      console.log('Multer processed req.file:', req.file);
      next(); // Siirry varsinaiseen kontrolleriin
    },
    postItem,
  );

mediaRouter
  .route('/:id')
  .get(getItemById)
  .put(authenticateToken, putItem)
  .delete(authenticateToken, deleteItem);

export default mediaRouter;
