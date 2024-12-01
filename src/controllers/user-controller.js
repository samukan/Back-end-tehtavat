// src/controllers/user-controller.js
import bcrypt from 'bcryptjs';
import {
  fetchUsers,
  fetchUserById,
  selectUserByUsername,
  addUserToDB,
  updateUserInDB,
  deleteUserFromDB,
} from '../models/user-model.js';

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
const getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.json(users);
  } catch (e) {
    next(e);
  }
};

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
const getUserById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const user = await fetchUserById(id);
    if (user) {
      res.json(user);
    } else {
      const error = new Error('User not found');
      error.status = 404;
      next(error);
    }
  } catch (e) {
    next(e);
  }
};

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
const addUser = async (req, res, next) => {
  try {
    const {username, password, email, user_level_id} = req.body;

    // Hashaa salasana
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      user_level_id,
    };

    // Tallenna uusi käyttäjä tietokantaan
    const id = await addUserToDB(newUser);
    res.status(201).json({message: 'User added', id});
  } catch (e) {
    next(e);
  }
};

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
const updateUser = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const {username, email, user_level_id} = req.body;
  const updatedUser = {username, email, user_level_id};
  try {
    const rowsAffected = await updateUserInDB(id, updatedUser);
    if (rowsAffected === 0) {
      const error = new Error('User not found');
      error.status = 404;
      next(error);
    } else {
      res.json({message: 'User updated', id: id});
    }
  } catch (e) {
    next(e);
  }
};

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
const deleteUser = async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const rowsAffected = await deleteUserFromDB(id);
    if (rowsAffected === 0) {
      const error = new Error('User not found');
      error.status = 404;
      next(error);
    } else {
      res.json({message: 'User deleted', id: id});
    }
  } catch (e) {
    next(e);
  }
};

export {getUsers, getUserById, addUser, updateUser, deleteUser};
