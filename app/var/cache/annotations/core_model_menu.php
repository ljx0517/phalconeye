<?php return Phalcon\Annotations\Reflection::__set_state(array(
  '_reflectionData' => 
 array (
   'class' => 
   array (
     0 => 
     array (
       'type' => 300,
       'name' => 'category',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
       'line' => 24,
     ),
     1 => 
     array (
       'type' => 300,
       'name' => 'package',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
       'line' => 24,
     ),
     2 => 
     array (
       'type' => 300,
       'name' => 'author',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
       'line' => 24,
     ),
     3 => 
     array (
       'type' => 300,
       'name' => 'phalconeye',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
       'line' => 24,
     ),
     4 => 
     array (
       'type' => 300,
       'name' => 'copyright',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
       'line' => 24,
     ),
     5 => 
     array (
       'type' => 300,
       'name' => 'license',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
       'line' => 24,
     ),
     6 => 
     array (
       'type' => 300,
       'name' => 'link',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
       'line' => 24,
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
             'value' => 'menus',
           ),
         ),
       ),
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
       'line' => 24,
     ),
     8 => 
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
             'value' => 'menu_id',
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
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
       'line' => 26,
     ),
     9 => 
     array (
       'type' => 300,
       'name' => 'method',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
       'line' => 26,
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
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
         'line' => 1,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'Identity',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
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
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
         'line' => 1,
       ),
     ),
     'name' => 
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
               'value' => 'name',
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
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
         'line' => 1,
       ),
     ),
   ),
   'methods' => 
   array (
     'getMenuItems' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
         'line' => 55,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
         'line' => 55,
       ),
     ),
     'beforeDelete' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
         'line' => 67,
       ),
     ),
     'getTableName' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
         'line' => 45,
       ),
     ),
     'get' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
         'line' => 70,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
         'line' => 70,
       ),
       2 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
         'line' => 70,
       ),
       3 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
         'line' => 70,
       ),
       4 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
         'line' => 70,
       ),
     ),
     'getFirst' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
         'line' => 97,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
         'line' => 97,
       ),
       2 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
         'line' => 97,
       ),
       3 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
         'line' => 97,
       ),
     ),
     'getBuilder' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
         'line' => 119,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
         'line' => 119,
       ),
     ),
     'getId' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\Core\\Model\\Menu.php',
         'line' => 139,
       ),
     ),
   ),
 ),
  '_classAnnotations' => NULL,
  '_methodAnnotations' => NULL,
  '_propertyAnnotations' => NULL,
));