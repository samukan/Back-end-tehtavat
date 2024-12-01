// src/controllers/likes-controller.js
import {
  fetchLikesByMediaId,
  fetchLikesByUserId,
  addLikeToDB,
  deleteLikeFromDB,
  fetchLikeById,
} from '../models/likes-model.js';

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
 * @apiSuccess {Number} likes.like_id Like ID.
 * @apiSuccess {Number} likes.media_id Media ID.
 * @apiSuccess {Number} likes.user_id User ID who liked.
 *
 * @apiError (500) InternalServerError Database error.
 */
const getLikesByMediaId = async (req, res) => {
  const mediaId = parseInt(req.params.id);
  try {
    const likes = await fetchLikesByMediaId(mediaId);
    res.json(likes);
  } catch (e) {
    console.error('getLikesByMediaId', e.message);
    res.status(500).json({message: 'DB error: ' + e.message});
  }
};

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
 * @apiSuccess {Number} likes.like_id Like ID.
 * @apiSuccess {Number} likes.media_id Media ID.
 * @apiSuccess {Number} likes.user_id User ID who liked.
 *
 * @apiError (500) InternalServerError Database error.
 */
const getLikesByUserId = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const likes = await fetchLikesByUserId(userId);
    res.json(likes);
  } catch (e) {
    console.error('getLikesByUserId', e.message);
    res.status(500).json({message: 'DB error: ' + e.message});
  }
};

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
const addLike = async (req, res) => {
  const {media_id} = req.body;
  const user_id = req.user.user_id;

  if (!media_id) {
    return res.status(400).json({message: 'media_id is required'});
  }

  try {
    const id = await addLikeToDB({media_id, user_id});
    res.status(201).json({message: 'Like added', id: id});
  } catch (e) {
    console.error('addLike', e.message);
    res.status(500).json({message: 'DB error: ' + e.message});
  }
};

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
const deleteLike = async (req, res) => {
  const like_id = parseInt(req.params.id);
  const user_id = req.user.user_id;

  try {
    const like = await fetchLikeById(like_id);

    if (!like) {
      return res.status(404).json({message: 'Like not found'});
    }

    if (like.user_id !== user_id && req.user.user_level_id !== 1) {
      return res
        .status(403)
        .json({message: 'Forbidden: You cannot delete this like'});
    }

    const rowsAffected = await deleteLikeFromDB(like_id);
    if (rowsAffected === 0) {
      res.status(404).json({message: 'Like not found'});
    } else {
      res.json({message: 'Like deleted', id: like_id});
    }
  } catch (e) {
    console.error('deleteLike', e.message);
    res.status(500).json({message: 'DB error: ' + e.message});
  }
};

export {getLikesByMediaId, getLikesByUserId, addLike, deleteLike};
