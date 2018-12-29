/*
* @Author: 羊驼
* @Date:   2018-12-24 20:09:06
* @Last Modified by:   羊驼
* @Last Modified time: 2018-12-25 17:29:46
*/
// 连接数据库模块
var mongoose=require('mongoose');
// 用户的表的结构
module.exports = new mongoose.Schema({
	// 用户名
	username:String,
	// 密码
	password:String,
	//注册时间
	registerTime:{
		type:String,
		default:new Date().getTime()
	},
	// 判断是否为管理员
	isAdmin:{
		type:Boolean,
		default:false
	},
	orderList:Array,
	cartList:[
		{
			product:Object,
			checked:{
				type:Boolean,
				default:true
			},
			productNum:Number
		}
	],
	adressList:Array
});