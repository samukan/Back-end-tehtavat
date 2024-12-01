// src/routes/media-router.js
import express from 'express';
import multer from 'multer';
import {
  getItemById,
  getItems,
  postItem,
  putItem,
  deleteItem,
} from '../controllers/media-controller.js';
import authenticateToken from '../middlewares/authentication.js';
import mediaValidationRules from '../validators/media-validator.js';
import validate from '../middlewares/validate.js';

const upload = multer({dest: 'uploads/'});

const mediaRouter = express.Router();

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
mediaRouter
  .route('/')
  .get(getItems)
  .post(
    authenticateToken,
    upload.single('file'),
    mediaValidationRules(),
    validate,
    postItem,
  );

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
mediaRouter
  .route('/:id')
  .get(getItemById)
  .put(
    authenticateToken,
    upload.single('file'),
    mediaValidationRules(),
    validate,
    putItem,
  )
  .delete(authenticateToken, deleteItem);

export default mediaRouter;
