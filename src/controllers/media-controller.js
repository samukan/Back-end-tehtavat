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
  const userId = 1;

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
  const {title, description} = req.body;
  console.log('put req body', req.body);
  const newDetails = {
    title,
    description,
  };
  try {
    const itemsEdited = await updateMediaItem(req.params.id, newDetails);
    if (itemsEdited === 0) {
      return res.status(404).json({message: 'Item not found'});
    } else if (itemsEdited === 1) {
      return res.status(200).json({message: 'Item updated', id: req.params.id});
    }
  } catch (error) {
    return res
      .status(500)
      .json({message: 'Something went wrong: ' + error.message});
  }
};

const deleteItem = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const itemsDeleted = await deleteMediaItem(id);
    if (itemsDeleted === 0) {
      return res.status(404).json({message: 'Item not found'});
    } else if (itemsDeleted === 1) {
      return res.status(200).json({message: 'Item deleted', id: id});
    }
  } catch (error) {
    return res
      .status(500)
      .json({message: 'Something went wrong: ' + error.message});
  }
};

export {getItems, getItemById, postItem, putItem, deleteItem};
