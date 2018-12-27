/*
* @Author: 羊驼
* @Date:   2018-12-24 20:09:14
* @Last Modified by:   羊驼
* @Last Modified time: 2018-12-24 20:33:32
*/
var mongoose=require('mongoose');

// 加载product结构
var userSchema = require('../schemas/user.js');

// 创建product模型
module.exports = mongoose.model('user',userSchema);