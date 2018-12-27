/*
* @Author: 羊驼
* @Date:   2018-12-24 12:22:44
* @Last Modified by:   羊驼
* @Last Modified time: 2018-12-24 12:23:07
*/
var mongoose=require('mongoose');

// 加载user结构
var productCatSchema = require('../schemas/productCat.js');

// 创建user模型
module.exports = mongoose.model('productCat',productCatSchema);