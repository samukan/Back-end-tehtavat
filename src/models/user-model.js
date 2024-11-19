// src/models/user-model.js
import promisePool from '../utils/database.js';

const fetchUsers = async () => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, username, email, user_level_id FROM Users',
    );
    return rows;
  } catch (e) {
    console.error('fetchUsers', e.message);
    throw new Error('Database error ' + e.message);
  }
};

const fetchUserById = async (id) => {
  try {
    const sql =
      'SELECT user_id, username, email, user_level_id FROM Users WHERE user_id = ?';
    const [rows] = await promisePool.query(sql, [id]);
    return rows[0];
  } catch (e) {
    console.error('fetchUserById', e.message);
    throw new Error('Database error ' + e.message);
  }
};

const selectUserByUsername = async (username) => {
  try {
    const sql = 'SELECT * FROM Users WHERE username = ?';
    const [rows] = await promisePool.query(sql, [username]);
    return rows[0];
  } catch (e) {
    console.error('selectUserByUsername', e.message);
    throw new Error('Database error ' + e.message);
  }
};

const addUserToDB = async (user) => {
  const sql =
    'INSERT INTO Users (username, password, email, user_level_id) VALUES (?, ?, ?, ?)';
  const params = [user.username, user.password, user.email, user.user_level_id];
  try {
    const [result] = await promisePool.query(sql, params);
    return result.insertId;
  } catch (e) {
    console.error('addUserToDB', e.message);
    throw new Error('Database error ' + e.message);
  }
};

const updateUserInDB = async (id, user) => {
  const sql =
    'UPDATE Users SET username = ?, email = ?, user_level_id = ? WHERE user_id = ?';
  const params = [user.username, user.email, user.user_level_id, id];
  try {
    const [result] = await promisePool.query(sql, params);
    return result.affectedRows;
  } catch (e) {
    console.error('updateUserInDB', e.message);
    throw new Error('Database error ' + e.message);
  }
};

const deleteUserFromDB = async (id) => {
  const sql = 'DELETE FROM Users WHERE user_id = ?';
  try {
    const [result] = await promisePool.query(sql, [id]);
    return result.affectedRows;
  } catch (e) {
    console.error('deleteUserFromDB', e.message);
    throw new Error('Database error ' + e.message);
  }
};

export {
  fetchUsers,
  fetchUserById,
  selectUserByUsername,
  addUserToDB,
  updateUserInDB,
  deleteUserFromDB,
};
