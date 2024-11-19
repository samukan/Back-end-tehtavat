// src/controllers/user-controller.js
import {
  fetchUsers,
  fetchUserById,
  selectUserByUsername,
  addUserToDB,
  updateUserInDB,
  deleteUserFromDB,
} from '../models/user-model.js';

const getUsers = async (req, res) => {
  try {
    const users = await fetchUsers();
    res.json(users);
  } catch (e) {
    console.error('getUsers', e.message);
    res.status(503).json({error: 503, message: 'DB error'});
  }
};

const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await fetchUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({message: 'User not found'});
    }
  } catch (e) {
    console.error('getUserById', e.message);
    res.status(503).json({error: 503, message: 'DB error'});
  }
};

const addUser = async (req, res) => {
  const {username, password, email, user_level_id} = req.body;
  if (!username || !password || !email || !user_level_id) {
    return res.status(400).json({message: 'All fields are required'});
  }
  try {
    // Tarkista, onko käyttäjätunnus jo käytössä
    const existingUser = await selectUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({message: 'Username already taken'});
    }

    const id = await addUserToDB({username, password, email, user_level_id});
    res.status(201).json({message: 'User added', id: id});
  } catch (e) {
    console.error('addUser', e.message);
    res.status(500).json({message: 'DB error: ' + e.message});
  }
};

const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const {username, email, user_level_id} = req.body;
  const updatedUser = {username, email, user_level_id};
  try {
    const rowsAffected = await updateUserInDB(id, updatedUser);
    if (rowsAffected === 0) {
      res.status(404).json({message: 'User not found'});
    } else {
      res.json({message: 'User updated', id: id});
    }
  } catch (e) {
    console.error('updateUser', e.message);
    res.status(500).json({message: 'DB error: ' + e.message});
  }
};

const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const rowsAffected = await deleteUserFromDB(id);
    if (rowsAffected === 0) {
      res.status(404).json({message: 'User not found'});
    } else {
      res.json({message: 'User deleted', id: id});
    }
  } catch (e) {
    console.error('deleteUser', e.message);
    res.status(500).json({message: 'DB error: ' + e.message});
  }
};

export {getUsers, getUserById, addUser, updateUser, deleteUser};
