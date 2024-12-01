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
import path from 'path';
import {fileURLToPath} from 'url';

dotenv.config();

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'pug');
app.set('views', 'src/views');

// Ota Helmet käyttöön kaikkialla muualla paitsi /docs-reitillä
app.use((req, res, next) => {
  if (req.path.startsWith('/docs')) {
    next();
  } else {
    helmet()(req, res, next);
  }
});

// Muokkaa CSP:tä /docs-reitillä sallimaan 'unsafe-eval'
app.use(
  '/docs',
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      },
    },
  }),
);

// Konfiguroi CORS
app.use(
  cors({
    origin: 'http://localhost:3000',
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

// Palvele dokumentaatiota
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/docs', express.static(path.join(__dirname, '../docs')));

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
