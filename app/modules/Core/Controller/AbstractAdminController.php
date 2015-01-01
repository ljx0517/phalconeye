<?php
/*
  +------------------------------------------------------------------------+
  | PhalconEye CMS                                                         |
  +------------------------------------------------------------------------+
  | Copyright (c) 2013-2014 PhalconEye Team (http://phalconeye.com/)       |
  +------------------------------------------------------------------------+
  | This source file is subject to the New BSD License that is bundled     |
  | with this package in the file LICENSE.txt.                             |
  |                                                                        |
  | If you did not receive a copy of the license and are unable to         |
  | obtain it through the world-wide-web, please send an email             |
  | to license@phalconeye.com so we can send you a copy immediately.       |
  +------------------------------------------------------------------------+
  | Author: Ivan Vorontsov <ivan.vorontsov@phalconeye.com>                 |
  +------------------------------------------------------------------------+
*/

namespace Core\Controller;

use Core\Model\Package;
use Core\Model\Settings;
use Engine\Navigation;
use Engine\Package\Manager;
use Engine\Asset\Manager as AssetManager;

/**
 * Base admin controller.
 *
 * @category  PhalconEye
 * @package   Core\Controller
 * @author    Ivan Vorontsov <ivan.vorontsov@phalconeye.com>
 * @copyright 2013-2014 PhalconEye Team
 * @license   New BSD License
 * @link      http://phalconeye.com/
 */
abstract class AbstractAdminController extends AbstractController
{
    /**
     * Initialize admin specific logic.
     *
     * @return void
     */
    public function initialize()
    {
        parent::initialize();
        if ($this->request->isAjax()) {
            return;
        }

        $this->_setupNavigation();
        $this->_setupAssets();
        $EM=$this->getEventsManager();
        if($EM){
        	$EM->fire("assets:after_setupAssets", $this);
        }

    }

    /**
     * Setup navigation.
     *
     * @return void
     */
    protected function _setupNavigation()
    {
        $path = explode('/', $this->request->get('_url'));

        $activeItem = '';
        $limit = (count($path) > 3 ? 1 : 0);
        for ($i = 1, $count = count($path); $i < $count - $limit && $i < 3; $i++) {
            $activeItem .= $path[$i] . '/';
        }
        $activeItem = substr($activeItem, 0, -1);

        $menuItems = [
            'admin' => [
                'href' => 'admin',
                'title' => '<span class="menu-text">Dashboard</span>',
                'prepend' => '<i class="menu-icon glyphicon glyphicon-home"></i>'
            ],
            'users' => [
                'title' => '<i class="menu-icon glyphicon glyphicon-tasks"></i><span class="menu-text">Manage</span>',
                'items' => [ // type - dropdown
                    'admin/users' => [
                        'title' => '<span class="menu-text">Users and Roles</span>',
                        'href' => 'admin/users',
                        'prepend' => '<i class="menu-icon glyphicon glyphicon-user"></i>'
                    ],
                    'admin/pages' => [
                        'title' => '<span class="menu-text">Pages</span>',
                        'href' => 'admin/pages',
                        'prepend' => '<i class="menu-icon glyphicon glyphicon-list-alt"></i>'
                    ],
                    'admin/menus' => [
                        'title' => '<span class="menu-text">Menus</span>',
                        'href' => 'admin/menus',
                        'prepend' => '<i class="menu-icon glyphicon glyphicon-th-list"></i>'
                    ],
                    'admin/languages' => [
                        'title' => '<span class="menu-text">Languages</span>',
                        'href' => 'admin/languages',
                        'prepend' => '<i class="menu-icon glyphicon glyphicon-globe"></i>'
                    ],
                    'admin/files' => [
                        'title' => '<span class="menu-text">Files</span>',
                        'href' => 'admin/files',
                        'prepend' => '<i class="menu-icon glyphicon glyphicon-file"></i>'
                    ],
                    'admin/packages' => [
                        'title' => '<span class="menu-text">Packages</span>',
                        'href' => 'admin/packages',
                        'prepend' => '<i class="menu-icon glyphicon glyphicon-th"></i>'
                    ]
                ]
            ],
            'settings' => [ // type - dropdown
                'title' => '<i class="menu-icon glyphicon glyphicon-tower"></i><span class="menu-text">Settings</span>',
                'items' => [
                    'admin/settings' => [
                        'title' => '<span class="menu-text">System</span>',
                        'href' => 'admin/settings',
                        'prepend' => '<i class="menu-icon glyphicon glyphicon-cog"></i>'
                    ],
                    'admin/settings/performance' => [
                        'title' => '<span class="menu-text">Performance</span>',
                        'href' => 'admin/performance',
                        'prepend' => '<i class="menu-icon glyphicon glyphicon-signal"></i>'
                    ],
                    'admin/access' => [
                        'title' => '<span class="menu-text">Access Rights</span>',
                        'href' => 'admin/access',
                        'prepend' => '<i class="menu-icon glyphicon glyphicon-lock"></i>'
                    ]
                ]
            ]
        ];

        $modules = Package::findByType(Manager::PACKAGE_TYPE_MODULE, 1);
        if ($modules->count()) {
            $modulesMenuItems = [];
            foreach ($modules as $module) {
                if ($module->is_system) {
                    continue;
                }
                $href = 'admin/module/' . $module->name;
                $modulesMenuItems[$href] = [
                    'title' => '<span class="menu-text">'.$module->title.'</span>',
                    'href' => $href,
                    'prepend' => '<i class="menu-icon glyphicon glyphicon-th-large"></i>'
                ];
            }

            if (!empty($modulesMenuItems)) {
                $menuItems['modules'] = [
                    'title' => '<span class="menu-text">Modules</span>',
                    'items' => $modulesMenuItems
                ];
            }
        }

        $navigation = new Navigation();
        $navigation
            ->setItems($menuItems)
            ->setActiveItem($activeItem)
            //->setListClass('nav nav-categories')
        	->setListClass('nav sidebar-menu')
            //->setDropDownItemClass('nav-category')
        	->setDropDownItemClass('')
            //->setDropDownItemMenuClass('nav')
       		->setDropDownItemMenuClass('submenu')
            ->setDropDownIcon('<i class="menu-expand"></i>')
            ->setEnabledDropDownHighlight(true);

        $this->view->headerNavigation = $navigation;
    }

    /**
     * Setup assets files.
     *
     * @return void
     */
    protected function _setupAssets()
    {
    	parent::_setupAssets();
		//var_dump($this->assets);exit();
        // Assets setup.
        $collection=$this->assets->get(
            AssetManager::DEFAULT_COLLECTION_CSS);
        $collection
            //$this->assets->getEmptyCssCollection()
        		//
        		->addCss('external/pace/1.0.0/themes/white/pace-theme-flash.css')
        		->addCss('external/font-awesome/4.2.0/css/font-awesome.min.css')
        		//
                ->addCss('external/bootstrap/3.3.1/css/bootstrap.min.css')
                ->addCss('external/bootstrap/plugins/bootstrap-switch/3.3.0/css/bootstrap3/bootstrap-switch.min.css')
                ->addCss('external/jquery-ui/1.10.4/jquery-ui.css')
                //->addCss('assets/css/core/admin/main.css')
        		->addCss('assets/css/core/admin/beyond.min.css')
        		->addCss('assets/css/core/admin/admin.css')
                ->join(false);
        //);

        $this->assets->get(AssetManager::DEFAULT_COLLECTION_JS)
        	//
        	->addJs('external/pace/1.0.0/pace.min.js')
        	->addJs('assets/js/core/admin/beyond.js')
        	->addJs('assets/js/core/admin/skins.min.js')
        	->addJs('external/jquery/plugins/slimscroll/1.3.3/jquery.slimscroll.min.js')
        	//
            ->addJs('external/bootstrap/3.3.1/js/bootstrap.min.js')
            ->addJs('external/bootstrap/plugins/bootstrap-switch/3.3.0/js/bootstrap-switch.min.js')
            ->addJs('external/ckeditor/4.3.2/ckeditor.js');

//         if ($this->di->has('profiler')) {
//         	$this->di->get('assets')
//         	->collection(AssetManager::DEFAULT_COLLECTION_CSS)
//         	->addCss('assets/css/core/profiler.css');

//         	$this->di->get('assets')
//         	->collection(AssetManager::DEFAULT_COLLECTION_JS)
//         	->addCss('assets/js/core/profiler.js');
//         }


    }

    /**
     * Clear cache
     *
     * @return void
     */
    protected function _clearCache()
    {
        $this->app->clearCache(PUBLIC_PATH . '/themes/' . Settings::getSetting('system_theme'));
    }
}

