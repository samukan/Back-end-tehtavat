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
import userValidationRules from '../validators/user-validator.js';
import validate from '../middlewares/validate.js';

const userRouter = express.Router();

userRouter
  .route('/')
  .get(authenticateToken, getUsers)
  .post(userValidationRules(), validate, addUser);

userRouter
  .route('/:id')
  .get(authenticateToken, getUserById)
  .put(authenticateToken, userValidationRules(), validate, updateUser)
  .delete(authenticateToken, deleteUser);

export default userRouter;
