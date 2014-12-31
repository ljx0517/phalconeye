<?php
namespace User\Model;
use Engine\Db\AbstractModel;
/**
 * Users_groups.
 *
 * @category  ERenkeji.com
 * @package   User\Model
 * @author    alex louis <ljx0517@gmail.com>
 * @copyright 2013-2014 ERenkeji Team
 * @license   New BSD License
 * @link      http://erenkeji.com/
 *
 * @Source("users_groups")
 * @BelongsTo("user_id",'\User\Model\User', "id",{
 * 	"alias": "user"
 * })
 * @BelongsTo("group_id",'\User\Model\group', "id",{
 * 	"alias": "group"
 * })
 */
class User_group extends AbstractModel{

	/**
	 * @Primary
	 * @Column(type="integer",nullable=false,column="user_id",unsigned=true)
	 */
	public $user_id;

	/**
	 * @Primary
	 * @Column(type="integer",nullable=false,column="group_id",unsigned=true)
	 */
	public $group_id;
}