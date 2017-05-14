<?php
/**
 * banner config file
 * @package banner
 * @version 0.0.1
 * @upgrade true
 */

return [
    '__name' => 'banner',
    '__version' => '0.0.1',
    '__git' => 'https://github.com/getphun/banner',
    '__files' => [
        'modules/banner'                    => ['install', 'remove', 'update'],
        'theme/site/static/js/friend.js'    => ['install', 'remove', 'update']
    ],
    '__dependencies' => [
        'db-mysql'
    ],
    '_services' => [
        'banner' => 'Banner\\Service\\Banner'
    ],
    '_autoload' => [
        'classes' => [
            'Banner\\Service\\Banner' => 'modules/banner/service/Banner.php',
            'Banner\\Model\\Banner' => 'modules/banner/model/Banner.php',
            'Banner\\Controller\\BannerController' => 'modules/banner/controller/BannerController.php'
        ],
        'files' => []
    ],
    
    '_routes' => [
        'site' => [
            'siteBanners' => [
                'rule' => '/comp/friends',
                'handler' => 'Banner\\Controller\\Banner::all'
            ]
        ]
    ]
];