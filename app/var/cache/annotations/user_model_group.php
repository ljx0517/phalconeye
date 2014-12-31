<?php return Phalcon\Annotations\Reflection::__set_state(array(
  '_reflectionData' => 
 array (
   'class' => 
   array (
     0 => 
     array (
       'type' => 300,
       'name' => 'category',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
       'line' => 9,
     ),
     1 => 
     array (
       'type' => 300,
       'name' => 'package',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
       'line' => 9,
     ),
     2 => 
     array (
       'type' => 300,
       'name' => 'author',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
       'line' => 9,
     ),
     3 => 
     array (
       'type' => 300,
       'name' => 'gmail',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
       'line' => 9,
     ),
     4 => 
     array (
       'type' => 300,
       'name' => 'copyright',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
       'line' => 9,
     ),
     5 => 
     array (
       'type' => 300,
       'name' => 'license',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
       'line' => 9,
     ),
     6 => 
     array (
       'type' => 300,
       'name' => 'link',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
       'line' => 9,
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
             'value' => 'groups',
           ),
         ),
       ),
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
       'line' => 9,
     ),
     8 => 
     array (
       'type' => 300,
       'name' => 'useDynamicUpdate',
       'arguments' => 
       array (
         0 => 
         array (
           'expr' => 
           array (
             'type' => 306,
           ),
         ),
       ),
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
       'line' => 9,
     ),
     9 => 
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
             'value' => '\\User\\Model\\User_group',
           ),
         ),
         2 => 
         array (
           'expr' => 
           array (
             'type' => 303,
             'value' => 'group_id',
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
                   'value' => 'group_id',
                 ),
                 'name' => 'alias',
               ),
             ),
           ),
         ),
       ),
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
       'line' => 11,
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
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 1,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'Identity',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
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
           4 => 
           array (
             'expr' => 
             array (
               'type' => 306,
             ),
             'name' => 'unsigned',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 1,
       ),
     ),
     'name' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'Index',
         'arguments' => 
         array (
           0 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'groups_name_unique',
             ),
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'unique',
             ),
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 1,
       ),
       1 => 
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
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 1,
       ),
     ),
     'description' => 
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
               'type' => 303,
               'value' => 'description',
             ),
             'name' => 'column',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '255',
             ),
             'name' => 'size',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 1,
       ),
     ),
     'permissions' => 
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
               'value' => 'text',
             ),
             'name' => 'type',
           ),
           1 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'permissions',
             ),
             'name' => 'column',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 1,
       ),
     ),
     'undeletable' => 
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
               'type' => 305,
             ),
             'name' => 'nullable',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'undeletable',
             ),
             'name' => 'column',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 1,
       ),
     ),
     'creation_date' => 
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
               'value' => 'datetime',
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
               'value' => 'creation_date',
             ),
             'name' => 'column',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 1,
       ),
     ),
     'modified_date' => 
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
               'value' => 'datetime',
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
               'value' => 'modified_date',
             ),
             'name' => 'column',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 1,
       ),
     ),
   ),
   'methods' => 
   array (
     'getGroupByName' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 64,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 64,
       ),
     ),
     'getTableName' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 45,
       ),
     ),
     'get' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 70,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 70,
       ),
       2 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 70,
       ),
       3 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 70,
       ),
       4 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 70,
       ),
     ),
     'getFirst' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 97,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 97,
       ),
       2 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 97,
       ),
       3 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 97,
       ),
     ),
     'getBuilder' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 119,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 119,
       ),
     ),
     'getId' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 139,
       ),
     ),
     'beforeCreate' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 44,
       ),
     ),
     'beforeUpdate' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\Group.php',
         'line' => 54,
       ),
     ),
   ),
 ),
  '_classAnnotations' => NULL,
  '_methodAnnotations' => NULL,
  '_propertyAnnotations' => NULL,
));