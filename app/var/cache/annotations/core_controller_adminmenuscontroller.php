<?php return Phalcon\Annotations\Reflection::__set_state(array(
  '_reflectionData' => 
 array (
   'class' => 
   array (
     0 => 
     array (
       'type' => 300,
       'name' => 'category',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
       'line' => 34,
     ),
     1 => 
     array (
       'type' => 300,
       'name' => 'package',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
       'line' => 34,
     ),
     2 => 
     array (
       'type' => 300,
       'name' => 'author',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
       'line' => 34,
     ),
     3 => 
     array (
       'type' => 300,
       'name' => 'phalconeye',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
       'line' => 34,
     ),
     4 => 
     array (
       'type' => 300,
       'name' => 'copyright',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
       'line' => 34,
     ),
     5 => 
     array (
       'type' => 300,
       'name' => 'license',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
       'line' => 34,
     ),
     6 => 
     array (
       'type' => 300,
       'name' => 'link',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
       'line' => 34,
     ),
     7 => 
     array (
       'type' => 300,
       'name' => 'RoutePrefix',
       'arguments' => 
       array (
         0 => 
         array (
           'expr' => 
           array (
             'type' => 303,
             'value' => '/admin/menus',
           ),
         ),
       ),
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
       'line' => 34,
     ),
   ),
   'methods' => 
   array (
     'init' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 48,
       ),
     ),
     'indexAction' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 79,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'Get',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '/',
             ),
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'admin-menus',
             ),
             'name' => 'name',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 79,
       ),
     ),
     'createAction' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 94,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'Route',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '/create',
             ),
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 308,
               'items' => 
               array (
                 0 => 
                 array (
                   'expr' => 
                   array (
                     'type' => 303,
                     'value' => 'GET',
                   ),
                 ),
                 1 => 
                 array (
                   'expr' => 
                   array (
                     'type' => 303,
                     'value' => 'POST',
                   ),
                 ),
               ),
             ),
             'name' => 'methods',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'admin-menus-create',
             ),
             'name' => 'name',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 94,
       ),
     ),
     'editAction' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 114,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 114,
       ),
       2 => 
       array (
         'type' => 300,
         'name' => 'Route',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '/edit/{id:[0-9]+}',
             ),
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 308,
               'items' => 
               array (
                 0 => 
                 array (
                   'expr' => 
                   array (
                     'type' => 303,
                     'value' => 'GET',
                   ),
                 ),
                 1 => 
                 array (
                   'expr' => 
                   array (
                     'type' => 303,
                     'value' => 'POST',
                   ),
                 ),
               ),
             ),
             'name' => 'methods',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'admin-menus-edit',
             ),
             'name' => 'name',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 114,
       ),
     ),
     'deleteAction' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 141,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 141,
       ),
       2 => 
       array (
         'type' => 300,
         'name' => 'Get',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '/delete/{id:[0-9]+}',
             ),
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'admin-menus-delete',
             ),
             'name' => 'name',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 141,
       ),
     ),
     'manageAction' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 164,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 164,
       ),
       2 => 
       array (
         'type' => 300,
         'name' => 'Get',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '/manage/{id:[0-9]+}',
             ),
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'admin-menus-manage',
             ),
             'name' => 'name',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 164,
       ),
     ),
     'createItemAction' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 213,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'Route',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '/create-item',
             ),
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 308,
               'items' => 
               array (
                 0 => 
                 array (
                   'expr' => 
                   array (
                     'type' => 303,
                     'value' => 'GET',
                   ),
                 ),
                 1 => 
                 array (
                   'expr' => 
                   array (
                     'type' => 303,
                     'value' => 'POST',
                   ),
                 ),
               ),
             ),
             'name' => 'methods',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'admin-menus-create-item',
             ),
             'name' => 'name',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 213,
       ),
     ),
     'editItemAction' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 265,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 265,
       ),
       2 => 
       array (
         'type' => 300,
         'name' => 'Route',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '/edit-item/{id:[0-9]+}',
             ),
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 308,
               'items' => 
               array (
                 0 => 
                 array (
                   'expr' => 
                   array (
                     'type' => 303,
                     'value' => 'GET',
                   ),
                 ),
                 1 => 
                 array (
                   'expr' => 
                   array (
                     'type' => 303,
                     'value' => 'POST',
                   ),
                 ),
               ),
             ),
             'name' => 'methods',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'admin-menus-edit-item',
             ),
             'name' => 'name',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 265,
       ),
     ),
     'deleteItemAction' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 314,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 314,
       ),
       2 => 
       array (
         'type' => 300,
         'name' => 'Get',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '/delete-item/{id:[0-9]+}',
             ),
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'admin-menus-delete-item',
             ),
             'name' => 'name',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 314,
       ),
     ),
     'orderAction' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 344,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'Post',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '/order',
             ),
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'admin-menus-order',
             ),
             'name' => 'name',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 344,
       ),
     ),
     'suggestAction' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 360,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'Get',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '/suggest',
             ),
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'admin-menus-suggest',
             ),
             'name' => 'name',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 360,
       ),
     ),
     '_clearMenuCache' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 395,
       ),
     ),
     'initialize' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 40,
       ),
     ),
     '_setupNavigation' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 56,
       ),
     ),
     '_setupAssets' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 174,
       ),
     ),
     '_clearCache' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 222,
       ),
     ),
     'afterExecuteRoute' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 81,
       ),
     ),
     'renderContent' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 93,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 93,
       ),
       2 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 93,
       ),
       3 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 93,
       ),
     ),
     'disableHeader' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 159,
       ),
     ),
     'disableFooter' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 171,
       ),
     ),
     'resolveModal' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 183,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 183,
       ),
     ),
     'addDefaultJsTranslations' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Controller\\AdminMenusController.php',
         'line' => 37,
       ),
     ),
   ),
 ),
  '_classAnnotations' => NULL,
  '_methodAnnotations' => NULL,
  '_propertyAnnotations' => NULL,
));