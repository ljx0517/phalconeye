<?php return Phalcon\Annotations\Reflection::__set_state(array(
  '_reflectionData' => 
 array (
   'class' => 
   array (
     0 => 
     array (
       'type' => 300,
       'name' => 'category',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
       'line' => 26,
     ),
     1 => 
     array (
       'type' => 300,
       'name' => 'package',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
       'line' => 26,
     ),
     2 => 
     array (
       'type' => 300,
       'name' => 'author',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
       'line' => 26,
     ),
     3 => 
     array (
       'type' => 300,
       'name' => 'phalconeye',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
       'line' => 26,
     ),
     4 => 
     array (
       'type' => 300,
       'name' => 'copyright',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
       'line' => 26,
     ),
     5 => 
     array (
       'type' => 300,
       'name' => 'license',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
       'line' => 26,
     ),
     6 => 
     array (
       'type' => 300,
       'name' => 'link',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
       'line' => 26,
     ),
     7 => 
     array (
       'type' => 300,
       'name' => 'Source',
       'arguments' => 
       array (
         0 => 
         array (
           'expr' => 
           array (
             'type' => 303,
             'value' => 'menu_items',
           ),
         ),
       ),
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
       'line' => 26,
     ),
     8 => 
     array (
       'type' => 300,
       'name' => 'BelongsTo',
       'arguments' => 
       array (
         0 => 
         array (
           'expr' => 
           array (
             'type' => 303,
             'value' => 'menu_id',
           ),
         ),
         1 => 
         array (
           'expr' => 
           array (
             'type' => 303,
             'value' => '\\Core\\Model\\Menu',
           ),
         ),
         2 => 
         array (
           'expr' => 
           array (
             'type' => 303,
             'value' => 'id',
           ),
         ),
         3 => 
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
                   'value' => 'Menu',
                 ),
                 'name' => 'alias',
               ),
             ),
           ),
         ),
       ),
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
       'line' => 28,
     ),
     9 => 
     array (
       'type' => 300,
       'name' => 'BelongsTo',
       'arguments' => 
       array (
         0 => 
         array (
           'expr' => 
           array (
             'type' => 303,
             'value' => 'parent_id',
           ),
         ),
         1 => 
         array (
           'expr' => 
           array (
             'type' => 303,
             'value' => '\\Core\\Model\\MenuItem',
           ),
         ),
         2 => 
         array (
           'expr' => 
           array (
             'type' => 303,
             'value' => 'id',
           ),
         ),
         3 => 
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
                   'value' => 'MenuItem',
                 ),
                 'name' => 'alias',
               ),
             ),
           ),
         ),
       ),
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
       'line' => 30,
     ),
     10 => 
     array (
       'type' => 300,
       'name' => 'HasMany',
       'arguments' => 
       array (
         0 => 
         array (
           'expr' => 
           array (
             'type' => 303,
             'value' => 'id',
           ),
         ),
         1 => 
         array (
           'expr' => 
           array (
             'type' => 303,
             'value' => '\\Core\\Model\\MenuItem',
           ),
         ),
         2 => 
         array (
           'expr' => 
           array (
             'type' => 303,
             'value' => 'parent_id',
           ),
         ),
         3 => 
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
                   'value' => 'MenuItem',
                 ),
                 'name' => 'alias',
               ),
             ),
           ),
         ),
       ),
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
       'line' => 32,
     ),
     11 => 
     array (
       'type' => 300,
       'name' => 'method',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
       'line' => 32,
     ),
   ),
   'properties' => 
   array (
     'id' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'Primary',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 1,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'Identity',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 1,
       ),
       2 => 
       array (
         'type' => 300,
         'name' => 'Column',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'integer',
             ),
             'name' => 'type',
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 305,
             ),
             'name' => 'nullable',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'id',
             ),
             'name' => 'column',
           ),
           3 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '11',
             ),
             'name' => 'size',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 1,
       ),
     ),
     'title' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'Column',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'string',
             ),
             'name' => 'type',
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 305,
             ),
             'name' => 'nullable',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'title',
             ),
             'name' => 'column',
           ),
           3 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '255',
             ),
             'name' => 'size',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 1,
       ),
     ),
     'menu_id' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'Column',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'integer',
             ),
             'name' => 'type',
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 305,
             ),
             'name' => 'nullable',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'menu_id',
             ),
             'name' => 'column',
           ),
           3 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '11',
             ),
             'name' => 'size',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 1,
       ),
     ),
     'parent_id' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'Column',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'integer',
             ),
             'name' => 'type',
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 306,
             ),
             'name' => 'nullable',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'parent_id',
             ),
             'name' => 'column',
           ),
           3 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '11',
             ),
             'name' => 'size',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 1,
       ),
     ),
     'page_id' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'Column',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'integer',
             ),
             'name' => 'type',
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 306,
             ),
             'name' => 'nullable',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'page_id',
             ),
             'name' => 'column',
           ),
           3 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '11',
             ),
             'name' => 'size',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 1,
       ),
     ),
     'url' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'Column',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'string',
             ),
             'name' => 'type',
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 306,
             ),
             'name' => 'nullable',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'url',
             ),
             'name' => 'column',
           ),
           3 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '255',
             ),
             'name' => 'size',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 1,
       ),
     ),
     'onclick' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'Column',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'string',
             ),
             'name' => 'type',
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 306,
             ),
             'name' => 'nullable',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'onclick',
             ),
             'name' => 'column',
           ),
           3 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '255',
             ),
             'name' => 'size',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 1,
       ),
     ),
     'target' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'Column',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'string',
             ),
             'name' => 'type',
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 306,
             ),
             'name' => 'nullable',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'target',
             ),
             'name' => 'column',
           ),
           3 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '10',
             ),
             'name' => 'size',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 1,
       ),
     ),
     'tooltip' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'Column',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'string',
             ),
             'name' => 'type',
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 306,
             ),
             'name' => 'nullable',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'tooltip',
             ),
             'name' => 'column',
           ),
           3 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '255',
             ),
             'name' => 'size',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 1,
       ),
     ),
     'tooltip_position' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'Column',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'string',
             ),
             'name' => 'type',
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 306,
             ),
             'name' => 'nullable',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'tooltip_position',
             ),
             'name' => 'column',
           ),
           3 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '10',
             ),
             'name' => 'size',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 1,
       ),
     ),
     'icon' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'Column',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'string',
             ),
             'name' => 'type',
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 306,
             ),
             'name' => 'nullable',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'icon',
             ),
             'name' => 'column',
           ),
           3 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '255',
             ),
             'name' => 'size',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 1,
       ),
     ),
     'icon_position' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'Column',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'string',
             ),
             'name' => 'type',
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 305,
             ),
             'name' => 'nullable',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'icon_position',
             ),
             'name' => 'column',
           ),
           3 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '10',
             ),
             'name' => 'size',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 1,
       ),
     ),
     'languages' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'Column',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'string',
             ),
             'name' => 'type',
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 306,
             ),
             'name' => 'nullable',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'languages',
             ),
             'name' => 'column',
           ),
           3 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '150',
             ),
             'name' => 'size',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 1,
       ),
     ),
     'roles' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'Column',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'string',
             ),
             'name' => 'type',
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 306,
             ),
             'name' => 'nullable',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'roles',
             ),
             'name' => 'column',
           ),
           3 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '150',
             ),
             'name' => 'size',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 1,
       ),
     ),
     'is_enabled' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'Column',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'boolean',
             ),
             'name' => 'type',
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'is_enabled',
             ),
             'name' => 'column',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 1,
       ),
     ),
     'item_order' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'Column',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'integer',
             ),
             'name' => 'type',
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 305,
             ),
             'name' => 'nullable',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'item_order',
             ),
             'name' => 'column',
           ),
           3 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '11',
             ),
             'name' => 'size',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 1,
       ),
     ),
   ),
   'methods' => 
   array (
     'getMenu' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 176,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 176,
       ),
     ),
     'getMenuItems' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 188,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 188,
       ),
     ),
     'getParent' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 200,
       ),
     ),
     'getOnclick' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 214,
       ),
     ),
     'getTooltip' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 224,
       ),
     ),
     'getLanguages' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 234,
       ),
     ),
     'prepareLanguages' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 248,
       ),
     ),
     'getRoles' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 260,
       ),
     ),
     'getHref' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 274,
       ),
     ),
     'isAllowed' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 292,
       ),
     ),
     'beforeDelete' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 322,
       ),
     ),
     'afterFetch' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 342,
       ),
     ),
     'beforeSave' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 358,
       ),
     ),
     'getTableName' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 45,
       ),
     ),
     'get' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 70,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 70,
       ),
       2 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 70,
       ),
       3 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 70,
       ),
       4 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 70,
       ),
     ),
     'getFirst' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 97,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 97,
       ),
       2 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 97,
       ),
       3 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 97,
       ),
     ),
     'getBuilder' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 119,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 119,
       ),
     ),
     'getId' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\MenuItem.php',
         'line' => 139,
       ),
     ),
   ),
 ),
  '_classAnnotations' => NULL,
  '_methodAnnotations' => NULL,
  '_propertyAnnotations' => NULL,
));