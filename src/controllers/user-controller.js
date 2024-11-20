// src/controllers/user-controller.js
import {
  fetchUsers,
  fetchUserById,
  selectUserByUsername,
  addUserToDB,
  updateUserInDB,
  deleteUserFromDB,
} from '../models/user-model.js';

const getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.json(users);
  } catch (e) {
    next(e);
  }
};

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

const addUser = async (req, res, next) => {
  const {username, password, email, user_level_id} = req.body;

  try {
    // Tarkista, onko käyttäjätunnus jo käytössä
    const existingUser = await selectUserByUsername(username);
    if (existingUser) {
      const error = new Error('Username already taken');
      error.status = 409;
      return next(error);
    }

    const id = await addUserToDB({username, password, email, user_level_id});
    res.status(201).json({message: 'User added', id: id});
  } catch (e) {
    next(e);
  }
};

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
