// src/controllers/auth-controller.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {selectUserByUsername} from '../models/user-model.js';
import 'dotenv/config';

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

const getMe = (req, res) => {
  if (req.user) {
    res.json({message: 'Authenticated', user: req.user});
  } else {
    res.status(401).json({message: 'Unauthorized'});
  }
};

export {postLogin, getMe};
