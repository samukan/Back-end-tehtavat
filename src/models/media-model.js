//src/models/media-model.js
import promisePool from '../utils/database.js';

const fetchMediaItems = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM MediaItems');
    return rows;
  } catch (e) {
    console.error('fetchMediaItems', e.message);
    throw new Error('Database error ' + e.message);
  }
};

const fetchMediaItemById = async (id) => {
  try {
    const sql = 'SELECT * FROM MediaItems WHERE media_id = ?';
    const [rows] = await promisePool.query(sql, [id]);
    console.log('fetchMediaItemById', rows);
    return rows[0];
  } catch (e) {
    console.error('fetchMediaItemById', e.message);
    throw new Error('Database error ' + e.message);
  }
};

const addMediaItem = async (newItem) => {
  const sql = `INSERT INTO MediaItems
                (user_id, title, description, filename, filesize, media_type)
                VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [
    newItem.user_id,
    newItem.title,
    newItem.description,
    newItem.filename,
    newItem.filesize,
    newItem.media_type,
  ];
  try {
    const [result] = await promisePool.query(sql, params);
    return result.insertId;
  } catch (error) {
    console.error('addMediaItem', error.message);
    throw new Error('Database error ' + error.message);
  }
};

const updateMediaItem = async (id, updatedItem) => {
  const sql = `UPDATE MediaItems SET title = ?, description = ? WHERE media_id = ?`;
  const params = [updatedItem.title, updatedItem.description, id];
  try {
    const [result] = await promisePool.query(sql, params);
    console.log('updateMediaItem', result);
    return result.affectedRows;
  } catch (error) {
    console.error('updateMediaItem', error.message);
    throw new Error('Database error ' + error.message);
  }
};

const deleteMediaItem = async (id) => {
  const sql = 'DELETE FROM MediaItems WHERE media_id = ?';
  try {
    const [result] = await promisePool.query(sql, [id]);
    return result.affectedRows;
  } catch (error) {
    console.error('deleteMediaItem', error.message);
    throw new Error('Database error ' + error.message);
  }
};

export {
  fetchMediaItems,
  fetchMediaItemById,
  addMediaItem,
  updateMediaItem,
  deleteMediaItem,
};
