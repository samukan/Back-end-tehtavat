// src/routes/user-router.js
import express from 'express';
import {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} from '../controllers/user-controller.js';
import authenticateToken from '../middlewares/authentication.js';

const userRouter = express.Router();

userRouter
  .route('/')
  .get(authenticateToken, getUsers) // Vain autentikoidut käyttäjät voivat listata käyttäjät
  .post(addUser); // Käyttäjän rekisteröinti on avoin

userRouter
  .route('/:id')
  .get(authenticateToken, getUserById)
  .put(authenticateToken, updateUser)
  .delete(authenticateToken, deleteUser);

export default userRouter;
