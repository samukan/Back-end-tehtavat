// src/controllers/media-controller.js
import {
  fetchMediaItems,
  addMediaItem,
  fetchMediaItemById,
  updateMediaItem,
  deleteMediaItem,
} from '../models/media-model.js';

const getItems = async (req, res) => {
  try {
    res.json(await fetchMediaItems());
  } catch (e) {
    console.error('getItems', e.message);
    res.status(503).json({error: 503, message: 'DB error'});
  }
};

const getItemById = async (req, res) => {
  const id = parseInt(req.params.id);
  console.log('getItemById', id);
  try {
    const item = await fetchMediaItemById(id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({message: 'Item not found'});
    }
  } catch (error) {
    console.error('getItemById', error.message);
    res.status(503).json({error: 503, message: error.message});
  }
};

const postItem = async (req, res) => {
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);

  const {title, description} = req.body;
  const userId = req.user.user_id; // Ota user_id autentikoidusta käyttäjästä

  const newMediaItem = {
    user_id: userId,
    title,
    description,
    filename: req.file.filename,
    filesize: req.file.size,
    media_type: req.file.mimetype,
    created_at: new Date().toISOString(),
  };

  console.log('New media item:', newMediaItem);

  try {
    const id = await addMediaItem(newMediaItem);
    res.status(201).json({message: 'Item added', id});
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(400).json({message: 'Something went wrong: ' + error.message});
  }
};

const putItem = async (req, res) => {
  const itemId = parseInt(req.params.id);
  const {title, description} = req.body;
  const userId = req.user.user_id;
  const userLevelId = req.user.user_level_id;

  try {
    // Hae mediaobjekti
    const item = await fetchMediaItemById(itemId);
    if (!item) {
      return res.status(404).json({message: 'Item not found'});
    }

    // Tarkista, onko käyttäjä omistaja tai admin
    if (item.user_id !== userId && userLevelId !== 1) {
      return res
        .status(403)
        .json({message: 'Forbidden: You do not own this item'});
    }

    const updatedItem = {title, description};
    const itemsEdited = await updateMediaItem(itemId, updatedItem);

    if (itemsEdited === 0) {
      return res.status(404).json({message: 'Item not found or not updated'});
    } else {
      return res.status(200).json({message: 'Item updated', id: itemId});
    }
  } catch (error) {
    console.error('putItem', error.message);
    return res
      .status(500)
      .json({message: 'Something went wrong: ' + error.message});
  }
};

const deleteItem = async (req, res) => {
  const itemId = parseInt(req.params.id);
  const userId = req.user.user_id;
  const userLevelId = req.user.user_level_id;

  try {
    // Hae mediaobjekti
    const item = await fetchMediaItemById(itemId);
    if (!item) {
      return res.status(404).json({message: 'Item not found'});
    }

    // Tarkista, onko käyttäjä omistaja tai admin
    if (item.user_id !== userId && userLevelId !== 1) {
      return res
        .status(403)
        .json({message: 'Forbidden: You do not own this item'});
    }

    const itemsDeleted = await deleteMediaItem(itemId);

    if (itemsDeleted === 0) {
      return res.status(404).json({message: 'Item not found or not deleted'});
    } else {
      return res.status(200).json({message: 'Item deleted', id: itemId});
    }
  } catch (error) {
    console.error('deleteItem', error.message);
    return res
      .status(500)
      .json({message: 'Something went wrong: ' + error.message});
  }
};

export {getItems, getItemById, postItem, putItem, deleteItem};
