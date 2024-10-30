import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set Pug as the view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "src", "views"));

// Serve static files from the 'public' directory at the root
app.use(express.static(path.join(__dirname, "src", "public")));

// Middleware to parse JSON bodies
app.use(express.json());

// Import mock data
import mediaData from "./src/data/media.json" assert { type: "json" };
import userData from "./src/data/users.json" assert { type: "json" };

// Render the landing page
app.get("/", (req, res) => {
  const host = `${req.protocol}://${req.get("host")}/`;
  const mediaItemsWithUrl = mediaData.map((item) => ({
    ...item,
    url: host + item.filename,
  }));

  res.render("index", {
    title: "My REST API",
    message: "This API allows you to manage media items and users.",
    mediaItems: mediaItemsWithUrl,
  });
});

// GET /api/media
app.get("/api/media", (req, res) => {
  const host = `${req.protocol}://${req.get("host")}/`;
  const mediaItemsWithUrl = mediaData.map((item) => ({
    ...item,
    url: host + item.filename,
  }));
  res.status(200).json(mediaItemsWithUrl);
});

// GET /api/media/:id
app.get("/api/media/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const mediaItem = mediaData.find((item) => item.media_id === id);

  if (mediaItem) {
    const host = `${req.protocol}://${req.get("host")}/`;
    const mediaItemWithUrl = {
      ...mediaItem,
      url: host + mediaItem.filename,
    };
    res.status(200).json(mediaItemWithUrl);
  } else {
    res.status(404).json({ error: "Media item not found" });
  }
});

// POST /api/media
app.post("/api/media", (req, res) => {
  const { filename, title, description, user_id, media_type } = req.body;

  if (!filename || !title || !user_id || !media_type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newMedia = {
    media_id: Date.now(),
    filename,
    title,
    description: description || "",
    user_id,
    media_type,
    created_at: new Date().toISOString(),
  };

  mediaData.push(newMedia);
  res.status(201).json(newMedia);
});

// PUT /api/media/:id
app.put("/api/media/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = mediaData.findIndex((item) => item.media_id === id);

  if (index !== -1) {
    mediaData[index] = { ...mediaData[index], ...req.body };
    res.status(200).json(mediaData[index]);
  } else {
    res.status(404).json({ error: "Media item not found" });
  }
});

// DELETE /api/media/:id
app.delete("/api/media/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = mediaData.findIndex((item) => item.media_id === id);

  if (index !== -1) {
    mediaData.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: "Media item not found" });
  }
});

// GET /api/user
app.get("/api/user", (req, res) => {
  res.status(200).json(userData);
});

// GET /api/user/:id
app.get("/api/user/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = userData.find((u) => u.user_id === id);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// POST /api/user
app.post("/api/user", (req, res) => {
  const { username, email, user_level_id } = req.body;

  if (!username || !email || !user_level_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newUser = {
    user_id: Date.now(),
    username,
    email,
    user_level_id,
    created_at: new Date().toISOString(),
  };

  userData.push(newUser);
  res.status(201).json(newUser);
});

// PUT /api/user/:id
app.put("/api/user/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = userData.findIndex((u) => u.user_id === id);

  if (index !== -1) {
    userData[index] = { ...userData[index], ...req.body };
    res.status(200).json(userData[index]);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// DELETE /api/user/:id
app.delete("/api/user/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = userData.findIndex((u) => u.user_id === id);

  if (index !== -1) {
    userData.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
