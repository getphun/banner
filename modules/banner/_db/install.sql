CREATE TABLE IF NOT EXISTS `banner` (
    `id` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `placement` VARCHAR(50) NOT NULL,
    -- 1 All
    -- 2 Desktop Only
    -- 3 Desktop and Tablet
    -- 4 Desktop and Phone
    -- 5 Tablet Only
    -- 6 Tablet and Phone
    -- 7 Phone Only
    `device` TINYINT DEFAULT 1,
    `expired` DATETIME,
    -- 1 Banner
    -- 2 Source
    -- 3 Google Ads
    -- 4 iFrame
    `type` TINYINT DEFAULT 1,
    
    -- Type Banner
    `ban_title` VARCHAR(150),
    `ban_image` VARCHAR(150),
    `ban_link` VARCHAR(250),
    
    -- Type Source
    `sou_text` TEXT,
    
    -- Type Google Ads
    `ga_ins` TEXT,
    
    -- Type iFrame
    `ifr_src` VARCHAR(150),
    
    `updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);