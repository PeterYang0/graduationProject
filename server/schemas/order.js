// 连接数据库模块
var mongoose = require('mongoose');
// 用户的表的结构
module.exports = new mongoose.Schema({
    username:String,
    orderId:Number,
    orderPayment:String,
    orderCreateTime: Number,
    orderStatus:Number,
    orderStatusDec:String,
    orderProduct:[
        {
            product:Object,
            productNum:Number,
            totalPrice:Number
        }
    ],
    orderTotalPrice:Number,
    orderAdress:Object
});