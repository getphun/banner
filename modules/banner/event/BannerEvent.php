<?php
/**
 * Banner events
 * @package banner
 * @version 0.0.1
 * @upgrade false
 */

namespace Banner\Event;

class BannerEvent{
    
    static function general($object, $old=null){
        \Phun::$dispatcher->cache->remove('banners');
    }
    
    static function created($object){
        self::general($object);
    }
    
    static function updated($object, $old=null){
        self::general($object, $old);
    }
    
    static function deleted($object){
        self::general($object);
    }
}