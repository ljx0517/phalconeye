<?php
class A{
	private $_attr1="挥挥手";
	public function __construct(){
		$this->__set($this->_attr1,"123123123");
	}

	//__get()方法用来获取私有属性
	public  function __get($property_name){
		if(isset($this->$property_name)) {
			return($this->$property_name);
		}else {
			return(NULL);
		}
	}
	//__set()方法用来设置私有属性
	public  function __set($property_name, $value){
		$this->$property_name = $value;
	}
}
$a=new A;
$attr="你";
$a->{"回家"}=111;
echo $a->{"挥挥手"};
var_dump($a);