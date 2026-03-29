-- Run in MySQL (mysql client or Workbench) before using the sample /api/notes routes.

CREATE DATABASE IF NOT EXISTS app_db;
USE app_db;

CREATE TABLE IF NOT EXISTS notes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  body VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

INSERT INTO notes (body) VALUES ('Hello from MySQL');
