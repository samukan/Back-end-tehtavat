import express from 'express';
import multer from 'multer';
import {
  getItemById,
  getItems,
  postItem,
  putItem,
  deleteItem,
} from '../controllers/media-controller.js';

// Määritä multerin tallennuspolku
const upload = multer({dest: 'uploads/'});

const mediaRouter = express.Router();

// Lisää upload.single('file') tiedoston lataamiseen
mediaRouter
  .route('/')
  .get(getItems)
  .post(
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
  .get(getItemById) // Hae yksittäinen media-item ID:llä
  .put(putItem) // Päivitä media-item
  .delete(deleteItem); // Poista media-item

export default mediaRouter;
