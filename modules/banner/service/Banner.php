<?php
/**
 * banner service
 * @package banner
 * @version 0.0.1
 * @upgrade true
 */

namespace Banner\Service;
use Core\Library\View;
use Banner\Model\Banner as MBanner;

class Banner {

    protected $_banners = [];
    
    public function __construct(){
        $cache_name = 'banners';
        $dis = \Phun::$dispatcher;
        
        $result = $dis->cache->get($cache_name);
        if($result && !is_dev()){
            $this->_banners = $result;
            return;
        }
        
        $now     = date('Y-m-d H:i:s');
        $banners = MBanner::get([
            'expired > :now AND timestart < :now',
            'bind'  => [
                'now' => $now
            ]
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
                'ga_ins' => 'script'
            ],
            4 => [  // iFrame
                'ifr_src' => 'src'
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
                    'type'  => (int)$ban->type,
                    'device'=> (int)$ban->device
                ];
                
                $props = $type_props[$ban->type];
                foreach($props as $prop => $name)
                    $obj[$name] = $ban->$prop;
                
                $result[$ban->placement][] = $obj;
            }
        }
        
        $cache_time = null;
        $nexts = MBanner::get([
            'expired > :expired OR timestart > :expired',
            'bind' => [
                'expired' => $now
            ]
        ], true);
        
        $time = time();
        foreach($nexts as $ban){
            $expired   = strtotime($ban->expired);
            $timestart = strtotime($ban->timestart);
            
            if($timestart > $time)
                $tocount = $timestart - $time;
            else
                $tocount = $expired - $time;
            
            if(is_null($cache_time) || $cache_time > $tocount)
                $cache_time = $tocount;
        }
        
        $dis->cache->save($cache_name, $result, $cache_time);
        
        $this->_banners = $result;
    }
    
    public function get($placement){
        return $this->_banners[$placement] ?? null;
    }
    
    public function getAll(){
        return $this->_banners;
    }
    
    public function render($ban){
        $tmpls = [
            1 => '<a href="${link}" target="_blank" title="${title}">'
              .      '<img src="${image}" alt="${title}">'
              .  '</a>',
            2 => '${script}',
            3 => '<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>'
              .  '${script}'
              .  '<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>',
            4 => '<iframe src="${src}" width="640" height="360"></iframe>'
        ];
        
        $tmpl = $tmpls[$ban['type']];
        foreach($ban as $key => $val)
            $tmpl = str_replace('${'.$key.'}', $val, $tmpl);
        return $tmpl;
    }
    
    public function single($placement, $tmpl=false, $loop=0, $size=false){
        $tx = '<script data-placement="' . $placement. '" type="application/friend"';
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