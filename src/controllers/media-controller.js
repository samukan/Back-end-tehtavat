// src/controllers/media-controller.js
import {
  fetchMediaItems,
  addMediaItem,
  fetchMediaItemById,
  updateMediaItem,
  deleteMediaItem,
} from '../models/media-model.js';

/**
 * @api {get} /api/media Get All Media Items
 * @apiName GetMediaItems
 * @apiGroup Media
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieve all media items.
 *
 * @apiSuccess {Object[]} media List of media items.
 *
 * @apiError (503) ServiceUnavailable Database error.
 */
const getItems = async (req, res) => {
  try {
    res.json(await fetchMediaItems());
  } catch (e) {
    console.error('getItems', e.message);
    res.status(503).json({error: 503, message: 'DB error'});
  }
};

/**
 * @api {get} /api/media/:id Get Media Item by ID
 * @apiName GetMediaItemById
 * @apiGroup Media
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieve a single media item by its ID.
 *
 * @apiParam {Number} id Media item's unique ID.
 *
 * @apiSuccess {Object} media Media item data.
 *
 * @apiError (404) NotFound Item not found.
 * @apiError (503) ServiceUnavailable Database error.
 */
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

/**
 * @api {post} /api/media Add New Media Item
 * @apiName PostMediaItem
 * @apiGroup Media
 * @apiVersion 1.0.0
 *
 * @apiDescription Add a new media item.
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiBody {String} title Title of the media item.
 * @apiBody {String} description Description of the media item.
 * @apiBody {File} file Media file to upload.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Number} id ID of the created media item.
 *
 * @apiError (400) BadRequest Validation error.
 * @apiError (401) Unauthorized Authentication required.
 * @apiError (500) InternalServerError Database error.
 */
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

/**
 * @api {put} /api/media/:id Update Media Item
 * @apiName PutMediaItem
 * @apiGroup Media
 * @apiVersion 1.0.0
 *
 * @apiDescription Update an existing media item.
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id Media item's unique ID.
 *
 * @apiBody {String} title Title of the media item.
 * @apiBody {String} description Description of the media item.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Number} id ID of the updated media item.
 *
 * @apiError (400) BadRequest Validation error.
 * @apiError (401) Unauthorized Authentication required.
 * @apiError (403) Forbidden You do not own this item.
 * @apiError (404) NotFound Item not found.
 * @apiError (500) InternalServerError Database error.
 */
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

/**
 * @api {delete} /api/media/:id Delete Media Item
 * @apiName DeleteMediaItem
 * @apiGroup Media
 * @apiVersion 1.0.0
 *
 * @apiDescription Delete a media item by ID.
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id Media item's unique ID.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Number} id ID of the deleted media item.
 *
 * @apiError (401) Unauthorized Authentication required.
 * @apiError (403) Forbidden You do not own this item.
 * @apiError (404) NotFound Item not found.
 * @apiError (500) InternalServerError Database error.
 */
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
