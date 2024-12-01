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
