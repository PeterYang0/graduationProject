/*
* @Author: 羊驼
* @Date:   2018-12-24 20:23:38
* @Last Modified by:   羊驼
* @Last Modified time: 2018-12-24 20:38:26
*/
var express = require('express');
 
var router = express.Router();
/*图片上传模块  即可以获取form表单的数据 也可以实现上传图片*/
var multiparty = require('multiparty'); 

var Product=require('../models/product');

router.get('/login',function(req,res,next){
	res.render('login');
});
router.get('/register',function(req,res,next){
	res.render('register');
});


 module.exports = router;