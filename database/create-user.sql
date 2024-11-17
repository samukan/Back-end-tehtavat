-- User creation examle, replace name and password with your own
-- real credentials are stored in a "secure" location (.env file)
CREATE USER 'sovelluskayttaja'@'localhost' IDENTIFIED BY 'salasana';
GRANT ALL PRIVILEGES ON *.* TO 'sovelluskayttaja'@'localhost';
FLUSH PRIVILEGES;