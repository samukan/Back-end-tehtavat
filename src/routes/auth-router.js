// src/routes/auth-router.js
import express from 'express';
import {postLogin, getMe} from '../controllers/auth-controller.js';
import authenticateToken from '../middlewares/authentication.js';

const authRouter = express.Router();

/**
 * @api {post} /api/auth/login User Login
 * @apiName PostLogin
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 *
 * @apiDescription Authenticate a user and receive a JWT token.
 *
 * @apiBody {String} username User's username.
 * @apiBody {String} password User's password.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} token JWT token.
 * @apiSuccess {Object} user User information.
 *
 * @apiError (401) Unauthorized Invalid credentials.
 */
authRouter.post('/login', postLogin);

/**
 * @api {get} /api/auth/me Get Current User
 * @apiName GetMe
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieve authenticated user's information.
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} user User information.
 *
 * @apiError (401) Unauthorized Authentication required.
 */
authRouter.get('/me', authenticateToken, getMe);

export default authRouter;
