import express from 'express';
import {
  getLikesByMediaId,
  getLikesByUserId,
  addLike,
  deleteLike,
} from '../controllers/likes-controller.js';

const likesRouter = express.Router();

likesRouter.route('/media/:id').get(getLikesByMediaId);
likesRouter.route('/user/:id').get(getLikesByUserId);
likesRouter.route('/').post(addLike);
likesRouter.route('/:id').delete(deleteLike);

export default likesRouter;
