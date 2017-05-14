<?php
/**
 * All banner providers
 * @package banner
 * @version 0.0.1
 * @upgrade true
 */

namespace Banner\Controller;
use Banner\Model\Banner;

class BannerController extends \Controller
{
    public function allAction(){
        $result = $this->banner->getAll();
        return $this->ajax(['data'=>$result]);
    }
}