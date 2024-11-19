//src/controllers/likes-controller.js
import {
  fetchLikesByMediaId,
  fetchLikesByUserId,
  addLikeToDB,
  deleteLikeFromDB,
  fetchLikeById,
} from '../models/likes-model.js';

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
