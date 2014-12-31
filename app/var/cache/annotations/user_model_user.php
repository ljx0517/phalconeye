<?php return Phalcon\Annotations\Reflection::__set_state(array(
  '_reflectionData' => 
 array (
   'class' => 
   array (
     0 => 
     array (
       'type' => 300,
       'name' => 'category',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
       'line' => 29,
     ),
     1 => 
     array (
       'type' => 300,
       'name' => 'package',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
       'line' => 29,
     ),
     2 => 
     array (
       'type' => 300,
       'name' => 'author',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
       'line' => 29,
     ),
     3 => 
     array (
       'type' => 300,
       'name' => 'phalconeye',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
       'line' => 29,
     ),
     4 => 
     array (
       'type' => 300,
       'name' => 'copyright',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
       'line' => 29,
     ),
     5 => 
     array (
       'type' => 300,
       'name' => 'license',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
       'line' => 29,
     ),
     6 => 
     array (
       'type' => 300,
       'name' => 'link',
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
       'line' => 29,
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
             'value' => 'users',
           ),
         ),
       ),
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
       'line' => 29,
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
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
       'line' => 29,
     ),
     9 => 
     array (
       'type' => 300,
       'name' => 'HasOne',
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
             'value' => 'user_id',
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
                   'value' => 'user_id',
                 ),
                 'name' => 'alias',
               ),
             ),
           ),
         ),
       ),
       'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
       'line' => 31,
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
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 1,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'Identity',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
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
               'type' => 306,
             ),
             'name' => 'unsigned',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 305,
             ),
             'name' => 'nullable',
           ),
           3 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'id',
             ),
             'name' => 'column',
           ),
           4 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => '11',
             ),
             'name' => 'size',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 1,
       ),
     ),
     'email' => 
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
               'value' => 'email',
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
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
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
               'value' => 'email',
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
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 1,
       ),
     ),
     'password' => 
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
               'value' => 'password',
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
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
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
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 1,
       ),
     ),
     'activated' => 
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
               'value' => 'activated',
             ),
             'name' => 'column',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 1,
       ),
     ),
     'activation_code' => 
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
               'value' => 'activation_code',
             ),
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
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
               'type' => 306,
             ),
             'name' => 'nullable',
           ),
           2 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'activation_code',
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
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 1,
       ),
     ),
     'activated_at' => 
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
               'type' => 303,
               'value' => 'activated_at',
             ),
             'name' => 'column',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 1,
       ),
     ),
     'last_login' => 
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
               'type' => 303,
               'value' => 'last_login',
             ),
             'name' => 'column',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 1,
       ),
     ),
     'persist_code' => 
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
               'value' => '255',
             ),
             'name' => 'size',
           ),
           3 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'persist_code',
             ),
             'name' => 'column',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 1,
       ),
     ),
     'reset_password_code' => 
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
               'value' => 'reset_password_code',
             ),
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
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
               'type' => 306,
             ),
             'name' => 'nullable',
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
           3 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'reset_password_code',
             ),
             'name' => 'column',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 1,
       ),
     ),
     'first_name' => 
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
               'value' => '255',
             ),
             'name' => 'size',
           ),
           3 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'first_name',
             ),
             'name' => 'column',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 1,
       ),
     ),
     'last_name' => 
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
               'value' => '255',
             ),
             'name' => 'size',
           ),
           3 => 
           array (
             'expr' => 
             array (
               'type' => 303,
               'value' => 'last_name',
             ),
             'name' => 'column',
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 1,
       ),
     ),
     'username' => 
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
               'value' => 'idx_username',
             ),
           ),
         ),
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
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
               'value' => 'username',
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
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 1,
       ),
     ),
     '_viewer' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'var',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
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
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
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
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 1,
       ),
     ),
   ),
   'methods' => 
   array (
     'setPassword' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 143,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 143,
       ),
     ),
     'getGroup' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 157,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 157,
       ),
     ),
     'isAdmin' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 199,
       ),
     ),
     'getViewer' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 209,
       ),
     ),
     'validation' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 233,
       ),
     ),
     'getTableName' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 45,
       ),
     ),
     'get' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 70,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 70,
       ),
       2 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 70,
       ),
       3 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 70,
       ),
       4 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 70,
       ),
     ),
     'getFirst' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 97,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 97,
       ),
       2 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 97,
       ),
       3 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 97,
       ),
     ),
     'getBuilder' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'param',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 119,
       ),
       1 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 119,
       ),
     ),
     'getId' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 139,
       ),
     ),
     'beforeCreate' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 44,
       ),
     ),
     'beforeUpdate' => 
     array (
       0 => 
       array (
         'type' => 300,
         'name' => 'return',
         'file' => 'E:\\xampp\\xampp\\htdocs\\PhalconEye\\app\\modules\\User\\Model\\User.php',
         'line' => 54,
       ),
     ),
   ),
 ),
  '_classAnnotations' => NULL,
  '_methodAnnotations' => NULL,
  '_propertyAnnotations' => NULL,
));