<?php
namespace User\Model;

use Engine\Db\AbstractModel;
use Engine\Db\Model\Behavior\Timestampable;
use Phalcon\Mvc\Model\Validator\Uniqueness;

/**
 * User.
 *
 * @category  ERenkeji.com
 * @package   User\Model
 * @author    alex louis <ljx0517@gmail.com>
 * @copyright 2013-2014 ERenkeji Team
 * @license   New BSD License
 * @link      http://erenkeji.com/
 *
 * @Source("groups")
 * @useDynamicUpdate(true);
 * @HasMany("id" ,'\User\Model\User_group', "group_id",{
 * 	"alias": "group_id"
 * })
 */
class Group extends AbstractModel{
	const
	/**
	 * Cache prefix.
	*/
	CACHE_PREFIX = 'groups_name_';


	use Timestampable;
	//use Uniqueness;

	/**
	 * @Primary
	 * @Identity
	 * @Column(type="integer", nullable=false, column="id", size="11",unsigned=true)
	 */
	public $id;

	/**
     * @Index("groups_name_unique","unique")
     * @Column(type="string", nullable=false, column="name", size="255")
     */
    public $name;

    /**
     * @Column(type="string", column="description", size="255")
     */
    public $description="";

    /**
     * @Column(type="text", column="permissions")
     */
    public $permissions;

    /**
     * @Column(type="boolean",  nullable=false, column="undeletable")
     */
    public $undeletable=0;

    /**
     * Get group by group name.
     *
     * @param string $type Role type.
     *
     * @return Role
     */
    public static function getGroupByName($name,$usecache=true)
    {
    	$query=[
    	"name = '{$type}'",
    	];
    	if($usecache){
    		$query[cache]=[
    				'key' => self::CACHE_PREFIX . $type
    			];
    	}
    	$role = Role::findFirst($query);
//     	if (!$role) {
//     			$role = new Role();
//     			$role->name = ucfirst($type);
//     			$role->description = ucfirst($type) . ' role.';
//     			$role->type = $type;
//     			$role->undeletable = 1;
//     			$role->save();
//     	}

    	return $role;
    }


}
