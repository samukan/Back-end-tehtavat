// src/index.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import mediaRouter from './routes/media-router.js';
import userRouter from './routes/user-router.js';
import likesRouter from './routes/likes-router.js';
import authRouter from './routes/auth-router.js';
import errorHandler from './middlewares/error-handler.js';

dotenv.config();

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'pug');
app.set('views', 'src/views');

// Ota käyttöön Helmet turvallisten HTTP-otsikoiden asettamiseksi
app.use(helmet());

// Konfiguroi CORS
app.use(
  cors({
    origin: 'http://localhost:3000', // Muokkaa tämä sallituiksi alkuperiksi
  }),
);

// Ota käyttöön Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuuttia
  max: 100, // Maksimimäärä pyyntöjä per IP per aikaikkuna
});
app.use(limiter);

app.use(express.json());

// Home page (client) as static html, css, js
app.use(express.static('public'));
// Uploaded media files
app.use('/uploads', express.static('uploads'));

// Api documentation page rendered with pug
app.get('/api', (req, res) => {
  res.render('index', {
    title: 'Media sharing REST API Documentation',
    version: process.env.npm_package_version,
  });
});

// Authentication endpoints
app.use('/api/auth', authRouter);

// Media resource endpoints
app.use('/api/media', mediaRouter);

// User resource endpoints
app.use('/api/users', userRouter);

// Likes resource endpoints
app.use('/api/likes', likesRouter);

// Error handling middleware
app.use(errorHandler);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
