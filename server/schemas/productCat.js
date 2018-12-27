/*
* @Author: 羊驼
* @Date:   2018-12-24 12:21:40
* @Last Modified by:   羊驼
* @Last Modified time: 2018-12-24 12:21:53
*/
// 连接数据库模块
var mongoose=require('mongoose');
// 用户的表的结构
module.exports = new mongoose.Schema({
	// 商品名
	productCat:String,
});