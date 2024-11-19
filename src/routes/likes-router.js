// src/routes/likes-router.js
import express from 'express';
import {
  getLikesByMediaId,
  getLikesByUserId,
  addLike,
  deleteLike,
} from '../controllers/likes-controller.js';
import authenticateToken from '../middlewares/authentication.js';

const likesRouter = express.Router();

likesRouter.route('/media/:id').get(getLikesByMediaId);
likesRouter.route('/user/:id').get(getLikesByUserId);
likesRouter.route('/').post(authenticateToken, addLike);
likesRouter.route('/:id').delete(authenticateToken, deleteLike);

export default likesRouter;
