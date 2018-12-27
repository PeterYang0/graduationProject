/*
* @Author: 羊驼
* @Date:   2018-12-21 11:57:26
* @Last Modified by:   羊驼
* @Last Modified time: 2018-12-24 15:27:32
*/
// 连接数据库模块
var mongoose=require('mongoose');
// 用户的表的结构
module.exports = new mongoose.Schema({
	// 商品名
	productName:String,
	// 商品url
	productUrl:String,
	productPrice:Number,
	//上架状态
	productStatus:Boolean,
	//购物车中默认选中
	productSclect:{
		type:Boolean,
		default:true
	},
	productDes:String,
	// 分类---是个关联字段
	productCat:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'productCat'
	},
	productCount:String
});