// src/middlewares/authentication.js
import jwt from 'jsonwebtoken';
import 'dotenv/config';

/**
 * @apiDefine AuthHeader
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiError (401) Unauthorized Token missing or invalid.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Odotetaan otsikkoa muodossa 'Bearer TOKEN'
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({message: 'Token missing'});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Sisältää user_id, username, user_level_id
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(403).json({message: 'Invalid token'});
  }
};

export default authenticateToken;
