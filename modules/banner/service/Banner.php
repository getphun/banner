<?php
/**
 * banner service
 * @package banner
 * @version 0.0.1
 * @upgrade true
 */

namespace Banner\Service;
use Core\Library\View;

class Banner {

    protected $_banners = [];
    
    public function __construct(){
        $cache_name = 'banners';
        $dis = \Phun::$dispatcher;
        
        $result = $dis->cache->get($cache_name);
        if($result && !is_dev())
            $this->_banners = $result;
        
        $cache_time = 0;
        $banners = \Banner\Model\Banner::get([
            'expired > :expiration',
            'bind'  => ['expiration' => date('Y-m-d H:i:s')]
        ], true, false, 'placement ASC, created ASC');
        
        if(!$banners)
            return;
        
        $type_props = [
            1 => [  // Banner
                'ban_title' => 'title',
                'ban_image' => 'image',
                'ban_link'  => 'link'
            ],
            2 => [  // Source
                'sou_text'  => 'script'
            ],
            3 => [  // Google Ads
                'ga_client' => 'client',
                'ga_slot'   => 'slot',
                'ga_format' => 'format'
            ],
            4 => [  // Facebook Audience Network
                'fan_placementid' => 'placementid',
                'fan_format'      => 'format'
            ]
        ];
        
        $result = [];
        if(count($banners)){
            foreach($banners as $ban){
                if(!isset($result[$ban->placement]))
                    $result[$ban->placement] = [];
                
                $obj = [
                    'id'    => $ban->id,
                    'name'  => $ban->name,
                    'type'  => $ban->type
                ];
                
                $props = $type_props[$ban->type];
                foreach($props as $prop => $name)
                    $obj[$name] = $ban->$prop;
                
                $result[$ban->placement][] = $obj;
                
                $expired = strtotime($ban->expired);
                if(!$cache_time || $expired < $cache_time)
                    $cache_time = $expired;
            }
        }
        
        $cache_time = $cache_time - time();
        $dis->cache->save($cache_name, $result, $cache_time);
        
        $this->_banners = $result;
    }
    
    public function get($name){
        return $this->_banners[$name] ?? null;
    }
    
    public function getAll(){
        return $this->_banners;
    }
    
    public function single($name, $tmpl=false, $loop=0, $size=false){
        $tx = '<script data-placement="' . $name. '" type="application/friend"';
        if($loop)
            $tx.= ' data-example="' . $loop . '"';
        if($size)
            $tx.= ' data-size="' . $size . '"';
        $tx.= '>';
        if($tmpl){
            $html = new View('site', $tmpl, []);
            $tx.= $html->content;
        }
        $tx.= '</script>';
        
        return $tx;
    }
}