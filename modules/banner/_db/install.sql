CREATE TABLE IF NOT EXISTS `banner` (
    `id` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `placement` VARCHAR(50) NOT NULL,
    `expired` DATETIME,
    -- 1 Banner
    -- 2 Source
    -- 3 Google Ads
    -- 4 Facebook Audience Network
    `type` TINYINT DEFAULT 1,
    
    -- Type Banner
    `ban_title` VARCHAR(150),
    `ban_image` VARCHAR(150),
    `ban_link` VARCHAR(250),
    
    -- Type Source
    `sou_text` TEXT,
    
    -- Type Google Ads
    `ga_client` VARCHAR(100),
    `ga_slot` VARCHAR(100),
    `ga_format` VARCHAR(100),
    
    -- Type Facebook Audience Network
    `fan_placementid` VARCHAR(150),
    `fan_format` VARCHAR(50),
    
    `updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);