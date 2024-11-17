import express from 'express';
import {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} from '../controllers/user-controller.js';

const userRouter = express.Router();

userRouter.route('/').get(getUsers).post(addUser);

userRouter.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

export default userRouter;
