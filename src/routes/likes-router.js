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

/**
 * @api {get} /api/likes/media/:id Get Likes by Media ID
 * @apiName GetLikesByMediaId
 * @apiGroup Likes
 * @apiVersion 1.0.0
 *
 * @apiDescription Fetch all likes associated with a specific media item.
 *
 * @apiParam {Number} id Media item's unique ID.
 *
 * @apiSuccess {Object[]} likes List of likes.
 *
 * @apiError (500) InternalServerError Database error.
 */
likesRouter.route('/media/:id').get(getLikesByMediaId);

/**
 * @api {get} /api/likes/user/:id Get Likes by User ID
 * @apiName GetLikesByUserId
 * @apiGroup Likes
 * @apiVersion 1.0.0
 *
 * @apiDescription Fetch all likes made by a specific user.
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {Object[]} likes List of likes.
 *
 * @apiError (500) InternalServerError Database error.
 */
likesRouter.route('/user/:id').get(getLikesByUserId);

/**
 * @api {post} /api/likes Add a Like
 * @apiName AddLike
 * @apiGroup Likes
 * @apiVersion 1.0.0
 *
 * @apiDescription Add a like to a media item.
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiBody {Number} media_id ID of the media item to like.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Number} id ID of the created like.
 *
 * @apiError (400) BadRequest media_id is required.
 * @apiError (401) Unauthorized Authentication required.
 * @apiError (500) InternalServerError Database error.
 */
likesRouter.route('/').post(authenticateToken, addLike);

/**
 * @api {delete} /api/likes/:id Delete a Like
 * @apiName DeleteLike
 * @apiGroup Likes
 * @apiVersion 1.0.0
 *
 * @apiDescription Delete a like by ID.
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id Like's unique ID.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Number} id ID of the deleted like.
 *
 * @apiError (401) Unauthorized Authentication required.
 * @apiError (403) Forbidden You cannot delete this like.
 * @apiError (404) NotFound Like not found.
 * @apiError (500) InternalServerError Database error.
 */
likesRouter.route('/:id').delete(authenticateToken, deleteLike);

export default likesRouter;
