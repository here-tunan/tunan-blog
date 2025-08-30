/*
 SQLite Schema for tunan-blog
 Converted from MySQL schema
 Date: 30/08/2025 12:00:00
*/

PRAGMA foreign_keys = OFF;

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `title` VARCHAR(255) DEFAULT NULL,
  `slug` VARCHAR(255) DEFAULT NULL,
  `content` TEXT,
  `view_number` INTEGER DEFAULT 0,
  `like_number` INTEGER DEFAULT 0,
  `type` INTEGER DEFAULT NULL,
  `is_deleted` INTEGER DEFAULT 0,
  `gmt_create` DATETIME DEFAULT NULL,
  `gmt_modified` DATETIME DEFAULT NULL
);

-- ----------------------------
-- Table structure for article_tag
-- ----------------------------
DROP TABLE IF EXISTS `article_tag`;
CREATE TABLE `article_tag` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` VARCHAR(100) DEFAULT NULL,
  `gmt_create` DATETIME DEFAULT NULL,
  UNIQUE(`name`)
);

-- ----------------------------
-- Table structure for article_tag_relationship
-- ----------------------------
DROP TABLE IF EXISTS `article_tag_relationship`;
CREATE TABLE `article_tag_relationship` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `article_id` INTEGER DEFAULT NULL,
  `tag_id` INTEGER DEFAULT NULL,
  `gmt_create` DATETIME DEFAULT NULL
);

-- ----------------------------
-- Table structure for book
-- ----------------------------
DROP TABLE IF EXISTS `book`;
CREATE TABLE `book` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` VARCHAR(200) DEFAULT NULL,
  `author` VARCHAR(60) DEFAULT NULL,
  `category` VARCHAR(50) DEFAULT NULL,
  `douban_link` VARCHAR(200) DEFAULT NULL,
  `my_review` VARCHAR(200) DEFAULT NULL,
  `score` INTEGER DEFAULT NULL,
  `gmt_create` DATETIME DEFAULT NULL,
  `gmt_modified` DATETIME DEFAULT NULL,
  `is_deleted` INTEGER DEFAULT 0
);

-- ----------------------------
-- Table structure for page_views
-- ----------------------------
DROP TABLE IF EXISTS `page_views`;
CREATE TABLE `page_views` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `path` VARCHAR(255) NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` TEXT,
  `created_at` DATETIME DEFAULT NULL
);

-- Create index for page_views
CREATE INDEX `idx_path` ON `page_views` (`path`);

-- ----------------------------
-- Table structure for project
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `github_url` VARCHAR(500) DEFAULT NULL,
  `demo_url` VARCHAR(500) DEFAULT NULL,
  `tech_stack` TEXT DEFAULT NULL, -- JSON stored as TEXT in SQLite
  `featured` INTEGER DEFAULT 0,
  `sort_order` INTEGER DEFAULT 0,
  `is_deleted` INTEGER DEFAULT 0,
  `gmt_create` DATETIME DEFAULT NULL,
  `gmt_modified` DATETIME DEFAULT NULL
);

-- Create indexes for project
CREATE INDEX `idx_featured` ON `project` (`featured`);
CREATE INDEX `idx_sort_order` ON `project` (`sort_order`);

-- ----------------------------
-- Table structure for device_app
-- ----------------------------
DROP TABLE IF EXISTS `device_app`;
CREATE TABLE `device_app` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `description` TEXT,
  `icon` VARCHAR(500) DEFAULT NULL,
  `link` VARCHAR(500) DEFAULT NULL,
  `sort_order` INTEGER DEFAULT 0,
  `is_deleted` INTEGER DEFAULT 0,
  `gmt_create` DATETIME DEFAULT NULL,
  `gmt_modified` DATETIME DEFAULT NULL
);

-- Create indexes for device_app
CREATE INDEX `idx_category` ON `device_app` (`category`);
CREATE INDEX `idx_sort_order` ON `device_app` (`sort_order`);

PRAGMA foreign_keys = ON;