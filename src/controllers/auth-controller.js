// src/controllers/auth-controller.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {selectUserByUsername} from '../models/user-model.js';
import 'dotenv/config';

/**
 * @api {post} /api/auth/login User Login
 * @apiName PostLogin
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 *
 * @apiDescription Authenticates a user and returns a JWT token.
 *
 * @apiBody {String} username User's unique username.
 * @apiBody {String} password User's password.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} token JWT token for authentication.
 * @apiSuccess {Object} user User information.
 * @apiSuccess {Number} user.user_id User's ID.
 * @apiSuccess {String} user.username User's username.
 * @apiSuccess {String} user.email User's email address.
 * @apiSuccess {Number} user.user_level_id User's role ID.
 *
 * @apiError (401) Unauthorized Invalid credentials.
 * @apiError (500) Internal Server Error.
 */
const postLogin = async (req, res) => {
  const {username, password} = req.body;
  try {
    // Hae käyttäjä käyttäjätunnuksella
    const user = await selectUserByUsername(username);
    if (!user) {
      return res.status(401).json({message: 'Invalid credentials'});
    }

    // Vertaa salasanoja bcryptillä
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({message: 'Invalid credentials'});
    }

    // Luo JWT-token
    const tokenPayload = {
      user_id: user.user_id,
      username: user.username,
      user_level_id: user.user_level_id,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    // Poista salasana vastauksesta
    delete user.password;

    res.json({message: 'Login successful', token, user});
  } catch (error) {
    console.error('postLogin', error.message);
    res.status(500).json({message: 'Server error'});
  }
};

/**
 * @api {get} /api/auth/me Get Current User
 * @apiName GetMe
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves the authenticated user's information.
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} user User information.
 * @apiSuccess {Number} user.user_id User's ID.
 * @apiSuccess {String} user.username User's username.
 * @apiSuccess {String} user.email User's email address.
 * @apiSuccess {Number} user.user_level_id User's role ID.
 *
 * @apiError (401) Unauthorized Authentication failed.
 */
const getMe = (req, res) => {
  if (req.user) {
    res.json({message: 'Authenticated', user: req.user});
  } else {
    res.status(401).json({message: 'Unauthorized'});
  }
};

export {postLogin, getMe};
