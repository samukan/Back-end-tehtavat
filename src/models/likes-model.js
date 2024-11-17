import promisePool from '../utils/database.js';

const fetchLikesByMediaId = async (mediaId) => {
  const sql = 'SELECT * FROM Likes WHERE media_id = ?';
  try {
    const [rows] = await promisePool.query(sql, [mediaId]);
    return rows;
  } catch (e) {
    console.error('fetchLikesByMediaId', e.message);
    throw new Error('Database error ' + e.message);
  }
};

const fetchLikesByUserId = async (userId) => {
  const sql = 'SELECT * FROM Likes WHERE user_id = ?';
  try {
    const [rows] = await promisePool.query(sql, [userId]);
    return rows;
  } catch (e) {
    console.error('fetchLikesByUserId', e.message);
    throw new Error('Database error ' + e.message);
  }
};

const addLikeToDB = async (like) => {
  const sql = 'INSERT INTO Likes (media_id, user_id) VALUES (?, ?)';
  const params = [like.media_id, like.user_id];
  try {
    const [result] = await promisePool.query(sql, params);
    return result.insertId;
  } catch (e) {
    console.error('addLikeToDB', e.message);
    throw new Error('Database error ' + e.message);
  }
};

const deleteLikeFromDB = async (id) => {
  const sql = 'DELETE FROM Likes WHERE like_id = ?';
  try {
    const [result] = await promisePool.query(sql, [id]);
    return result.affectedRows;
  } catch (e) {
    console.error('deleteLikeFromDB', e.message);
    throw new Error('Database error ' + e.message);
  }
};

export {fetchLikesByMediaId, fetchLikesByUserId, addLikeToDB, deleteLikeFromDB};
