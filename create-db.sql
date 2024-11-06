-- Pudota olemassa olevat taulut
DROP TABLE IF EXISTS MediaTags;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Likes;
DROP TABLE IF EXISTS Followers;
DROP TABLE IF EXISTS MediaItems;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Tags;
DROP TABLE IF EXISTS UserLevels;

-- Luo tietokanta
DROP DATABASE IF EXISTS mediashare;
CREATE DATABASE mediashare;
USE mediashare;

-- Luo taulut
CREATE TABLE UserLevels (
  user_level_id INT NOT NULL AUTO_INCREMENT,
  level_name VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (user_level_id)
);

CREATE TABLE Users (
  user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  user_level_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_level_id) REFERENCES UserLevels(user_level_id)
);

CREATE TABLE MediaItems (
  media_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  filesize INT NOT NULL,
  media_type VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP NOT NULL,
  PRIMARY KEY (media_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Tags (
  tag_id INT NOT NULL AUTO_INCREMENT,
  tag_name VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (tag_id)
);

CREATE TABLE MediaTags (
  media_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (media_id, tag_id),
  FOREIGN KEY (media_id) REFERENCES MediaItems(media_id),
  FOREIGN KEY (tag_id) REFERENCES Tags(tag_id)
);

CREATE TABLE Comments (
  comment_id INT NOT NULL AUTO_INCREMENT,
  media_id INT NOT NULL,
  user_id INT NOT NULL,
  comment_text VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (comment_id),
  FOREIGN KEY (media_id) REFERENCES MediaItems(media_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Likes (
  like_id INT NOT NULL AUTO_INCREMENT,
  media_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (like_id),
  FOREIGN KEY (media_id) REFERENCES MediaItems(media_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Followers (
  user_id INT NOT NULL,
  follower_id INT NOT NULL,
  PRIMARY KEY (user_id, follower_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (follower_id) REFERENCES Users(user_id)
);

-- Syöttää testidata
INSERT INTO UserLevels (level_name) VALUES
('Admin'),
('Moderator'),
('User');

INSERT INTO Users (user_id, username, password, email, user_level_id, created_at) VALUES
(260, 'VCHar', 'secret123', 'vchar@example.com', 3, NULL),
(305, 'Donatello', 'secret234', 'dona@example.com', 3, NULL);

INSERT INTO MediaItems (media_id, user_id, filename, filesize, media_type, title, description, created_at) VALUES
(1, 305, 'ffd8.jpg', 887574, 'image/jpeg', 'Favorite drink', NULL, NULL),
(2, 305, 'dbbd.jpg', 60703, 'image/jpeg', 'Miika', 'My Photo', NULL),
(3, 260, '2f9b.jpg', 30635, 'image/jpeg', 'Aksux and Jane', 'friends', NULL);

INSERT INTO Tags (tag_name) VALUES
('Nature'),
('Portrait'),
('Abstract'),
('Travel'),
('Food');

INSERT INTO MediaTags (media_id, tag_id) VALUES
(1, 1),
(1, 4),
(2, 2);

INSERT INTO Comments (media_id, user_id, comment_text) VALUES
(1, 260, 'Upea kuva!'),
(2, 305, 'Hieno otos!');

INSERT INTO Likes (media_id, user_id) VALUES
(1, 260),
(1, 305),
(2, 260);

INSERT INTO Followers (user_id, follower_id) VALUES
(305, 260);

-- Esimerkkikyselyt
-- Hae mediaobjektit tunnisteella 'Nature'
SELECT MediaItems.title
FROM MediaItems
JOIN MediaTags ON MediaItems.media_id = MediaTags.media_id
JOIN Tags ON MediaTags.tag_id = Tags.tag_id
WHERE Tags.tag_name = 'Nature';

-- Hae kommentit mediaobjektille 1
SELECT Comments.comment_text, Users.username, Comments.created_at
FROM Comments
JOIN Users ON Comments.user_id = Users.user_id
WHERE Comments.media_id = 1
ORDER BY Comments.created_at DESC;

-- Laske tykkäykset mediaobjektille 1
SELECT MediaItems.title, COUNT(Likes.like_id) AS like_count
FROM MediaItems
LEFT JOIN Likes ON MediaItems.media_id = Likes.media_id
WHERE MediaItems.media_id = 1
GROUP BY MediaItems.media_id;
