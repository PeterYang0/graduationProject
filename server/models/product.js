/*
* @Author: 羊驼
* @Date:   2018-12-21 12:13:51
* @Last Modified by:   羊驼
* @Last Modified time: 2018-12-24 20:08:23
*/
var mongoose=require('mongoose');

// 加载product结构
var productSchema = require('../schemas/product.js');

// 创建product模型
module.exports = mongoose.model('product',productSchema);