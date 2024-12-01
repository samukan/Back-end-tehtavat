// src/routes/user-router.js
import express from 'express';
import {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} from '../controllers/user-controller.js';
import authenticateToken from '../middlewares/authentication.js';
import userValidationRules from '../validators/user-validator.js';
import validate from '../middlewares/validate.js';

const userRouter = express.Router();

/**
 * @api {get} /api/users Get All Users
 * @apiName GetUsers
 * @apiGroup Users
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieve a list of all users. Requires authentication.
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {Object[]} users List of users.
 *
 * @apiError (401) Unauthorized Authentication required.
 * @apiError (500) InternalServerError Server error.
 */

/**
 * @api {post} /api/users Register a New User
 * @apiName AddUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 *
 * @apiDescription Register a new user.
 *
 * @apiBody {String} username Username (min 3 characters).
 * @apiBody {String} password Password (min 6 characters).
 * @apiBody {String} email User's email address.
 * @apiBody {Number} user_level_id User level ID (1 for admin, 2 for regular user).
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Number} id ID of the created user.
 *
 * @apiError (400) BadRequest Validation error.
 * @apiError (500) InternalServerError Server error.
 */
userRouter
  .route('/')
  .get(authenticateToken, getUsers)
  .post(userValidationRules(), validate, addUser);

/**
 * @api {get} /api/users/:id Get User by ID
 * @apiName GetUserById
 * @apiGroup Users
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieve user information by ID. Requires authentication.
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {Object} user User information.
 *
 * @apiError (401) Unauthorized Authentication required.
 * @apiError (404) NotFound User not found.
 * @apiError (500) InternalServerError Server error.
 */

/**
 * @api {put} /api/users/:id Update User
 * @apiName UpdateUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 *
 * @apiDescription Update user information. Requires authentication.
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiBody {String} username Username (min 3 characters).
 * @apiBody {String} email User's email address.
 * @apiBody {Number} user_level_id User level ID (1 for admin, 2 for regular user).
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Number} id ID of the updated user.
 *
 * @apiError (400) BadRequest Validation error.
 * @apiError (401) Unauthorized Authentication required.
 * @apiError (404) NotFound User not found.
 * @apiError (500) InternalServerError Server error.
 */

/**
 * @api {delete} /api/users/:id Delete User
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 *
 * @apiDescription Delete a user by ID. Requires authentication.
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Number} id ID of the deleted user.
 *
 * @apiError (401) Unauthorized Authentication required.
 * @apiError (404) NotFound User not found.
 * @apiError (500) InternalServerError Server error.
 */
userRouter
  .route('/:id')
  .get(authenticateToken, getUserById)
  .put(authenticateToken, userValidationRules(), validate, updateUser)
  .delete(authenticateToken, deleteUser);

export default userRouter;
