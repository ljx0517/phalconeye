<?php
namespace User\Model;
use Engine\Db\AbstractModel;
/**
 * Throttle.
 *
 * @category  ERenkeji.com
 * @package   User\Model
 * @author    alex louis <ljx0517@gmail.com>
 * @copyright 2013-2014 ERenkeji Team
 * @license   New BSD License
 * @link      http://erenkeji.com/
 *
 * @Source("throttle")
 * @useDynamicUpdate(true);
 */
class Throttle extends AbstractModel
{
	/**
	 * @Primary
	 * @Identity
	 * @Column(type="integer",column="id", size="11")
	 */
	public $id;

	/**
	 * @Index("throttle_user_id_index","unique")
	 * @Column(type="integer", unsigned=true, column="user_id", size="11")
	 */
	public $user_id;

	/**
	 * @Column(type="string",  column="ip_address", size="255")
	 */
	public $ip_address;

	/**
	 * @Column(type="integer",  nullable=false,default=0, column="attempts")
	 */
	public $attempts=0;

	/**
	 * @Column(type="boolean",  nullable=false,default=0, column="suspended")
	 */
	public $suspended=0;

	/**
	 * @Column(type="boolean",  nullable=false, default=0, column="banned")
	 */
	public $banned=0;

	/**
	 * @Column(type="datetime", nullable=true, column="last_attempt_at")
	 */
	public $last_attempt_at;

	/**
	 * @Column(type="datetime", nullable=true, column="suspended_at")
	 */
	public $suspended_at;

	/**
	 * @Column(type="datetime", nullable=true, column="banned_at")
	 */
	public $banned_at;
}