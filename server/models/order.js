var mongoose = require('mongoose');

// 加载order结构
var productSchema = require('../schemas/order.js');

// 创建product模型
module.exports = mongoose.model('order', productSchema);