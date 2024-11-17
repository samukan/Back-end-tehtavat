import {
  fetchLikesByMediaId,
  fetchLikesByUserId,
  addLikeToDB,
  deleteLikeFromDB,
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
  const {media_id, user_id} = req.body;
  if (!media_id || !user_id) {
    return res.status(400).json({message: 'media_id and user_id are required'});
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
  const id = parseInt(req.params.id);
  try {
    const rowsAffected = await deleteLikeFromDB(id);
    if (rowsAffected === 0) {
      res.status(404).json({message: 'Like not found'});
    } else {
      res.json({message: 'Like deleted', id: id});
    }
  } catch (e) {
    console.error('deleteLike', e.message);
    res.status(500).json({message: 'DB error: ' + e.message});
  }
};

export {getLikesByMediaId, getLikesByUserId, addLike, deleteLike};
