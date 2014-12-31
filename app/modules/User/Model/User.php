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

namespace User\Model;

use Engine\Db\AbstractModel;
use Engine\Db\Model\Behavior\Timestampable;
use Phalcon\Mvc\Model\Validator\Email;
use Phalcon\Mvc\Model\Validator\StringLength;
use Phalcon\Mvc\Model\Validator\Uniqueness;
use Phalcon\DI ;

/**
 * User.
 *
 * @category  PhalconEye
 * @package   User\Model
 * @author    Ivan Vorontsov <ivan.vorontsov@phalconeye.com>
 * @copyright 2013-2014 PhalconEye Team
 * @license   New BSD License
 * @link      http://phalconeye.com/
 *
 * @Source("users")
 * @useDynamicUpdate(true);
 * @HasOne("id" ,'\User\Model\User_group', "user_id",{
 * 	"alias": "user_id"
 * })
 */
class User extends AbstractModel
{
    const
        /**
         * Cache prefix.
         */
        CACHE_PREFIX = 'role_id_';

    // use trait Timestampable for creation_date and modified_date fields.
    use Timestampable;

    /**
     * @Primary
     * @Identity
     * @Column(type="integer", unsigned=true,nullable=false, column="id", size="11")
     */
    public $id;

    /**
     * @Index("email",'unique')
     * @Column(type="string", nullable=false, column="email", size="255")
     */
    public $email;

    /**
     * @Column(type="string", nullable=false, column="password", size="255")
     */
    public $password;

    /**
     * @Column(type="text", column="permissions")
     */
    public $permissions;

    /**
     * @Column(type="boolean", column="activated")
     */
    public $activated;

    /**
     * @Index("activation_code")
     * @Column(type="string", nullable=true, column="activation_code", size="255")
     */
    public $activation_code;

    /**
     * @Column(type="datetime", column="activated_at")
     */
    public $activated_at;

    /**
     * @Column(type="datetime",column="last_login")
     */
    public $last_login;

    /**
     * @Column(type="string", nullable=true, size="255",column="persist_code")
     */
    public $persist_code;

    /**
     * @Index("reset_password_code")
     * @Column(type="string", nullable=true, size="255",column="reset_password_code")
     */
    public $reset_password_code;

    /**
     * @Column(type="string", nullable=true, size="255",column="first_name")
     */
    public $first_name;

    /**
     * @Column(type="string", nullable=true, size="255",column="last_name")
     */
    public $last_name;






    /**
     * @Index("idx_username")
     * @Column(type="string", nullable=false, column="username", size="255")
     */
    public $username;





    /**
     * Current viewer.
     *
     * @var User null
     */
    private static $_viewer = null;

    /**
     * Set user password.
     *
     * @param string $password User password.
     *
     * @return void
     */
    public function setPassword($password)
    {
        if ($this->getId() === null || !empty($password) && $this->password != $password) {
            $this->password = $this->getDI()->get('security')->hash($password);
        }
    }

    /**
     * Return the related "Role" entity.
     *
     * @param array $arguments Arguments data.
     *
     * @return Role
     */
    public function getGroup($arguments = [],$usecache=true)
    {
    	$cache=array();
    	if($usecache){
    		$cache['cache'] = array(
    				'key' => self::CACHE_PREFIX . $this->id
    		);
    	}
    	$arguments = array_merge(
    		$arguments,$cache
    	);
//     	$group = $this->getRelated('user_id', $arguments)->getRelated("group",$arguments);
    	$builder = $this->getModelsManager()->createBuilder()
    		->columns('User\Model\Group.id,User\Model\Group.name')
	    	->from('User\Model\User')
	    	->leftJoin('User\Model\User_group', 'User\Model\User.id = User\Model\User_group.user_id ')
    		->leftJoin('User\Model\Group', 'User\Model\User_group.group_id = User\Model\Group.id ')
    		->where('User\Model\User.id = :user_id:', array('user_id' => $this->id))
    		->getQuery();
    		//->execute();
    		//->getSingleResult();

//     	$parsed  = $builder->parse();
//     	$sql     = \Phalcon\DI::getDefault()->getShared('db')->getDialect()->select($parsed);
//     	var_dump($sql);exit();
    	$group=$builder->getSingleResult();
		//
    	if (!$group) {
    		$group = new Group();
    		$group->id = 0;
    		$group->name = '';
    	}
    	return $group;
    }

    /**
     * Will check if user have Admin role.
     *
     * @return bool
     */
    public function isAdmin()
    {
        return $this->getGroup()->name == \Core\Api\Acl::DEFAULT_ROLE_ADMIN;
    }

    /**
     * Get current user
     * If user logged in this function will return user object with data
     * If user isn't logged in this function will return empty user object with ID = 0
     *
     * @return User
     */
    public static function getViewer()
    {
        if (null === self::$_viewer) {
            $identity = DI::getDefault()->get('core')->auth()->getIdentity();
            if ($identity) {
                self::$_viewer = self::findFirst($identity);
            }
            if (!self::$_viewer) {
                self::$_viewer = new User();
                self::$_viewer->id = 0;
                //self::$_viewer->role_id = Role::getRoleByType(Acl::DEFAULT_ROLE_GUEST)->id;
            }
        }

        return self::$_viewer;
    }

    /**
     * Validations and business logic.
     *
     * @return bool
     */
    public function validation()
    {
        if ($this->_errorMessages === null) {
            $this->_errorMessages = [];
        }

        $this->validate(new Uniqueness(["field" => "username"]));
        $this->validate(new Uniqueness(["field" => "email"]));
        $this->validate(new Email(["field" => "email", "required" => true]));
        $this->validate(new StringLength(["field" => "password", "min" => 6]));

        return $this->validationHasFailed() !== true;
    }

}