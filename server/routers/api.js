/*
* @Author: 羊驼
* @Date:   2018-12-20 19:59:59
* @Last Modified by:   羊驼
* @Last Modified time: 2018-12-26 21:24:20
*/
var express = require('express');
//md5加密模块
var md5 = require('md5-node');

var router = express.Router();
/*图片上传模块  即可以获取form表单的数据 也可以实现上传图片*/
var multiparty = require('multiparty'); 

var Product=require('../models/product');
var User=require('../models/user');



// 统一返回数据格式
var resData={};
router.use(function(req,res,next){
    resData={
        code:0,
        msg:''
    };
    next();
});
//登录
router.post('/user/login',function(req,res,next){
    var username=req.body.username;
    var password=md5(req.body.password);
    User.findOne({
        username:username
    }).then(function(userInfo){
        if (userInfo) {
            User.findOne({
                username:username,
                password:password
            }).then(function(userInfo){
                if (userInfo) {
                    resData.msg='登录成功';
                    resData.userInfo={
                        _id:userInfo._id,
                        username:userInfo.username,
                        isAdmin:userInfo.isAdmin
                    };
                    // 设置cookie，存储登录状态
                    req.cookies.set('userInfo',JSON.stringify({
                        _id:userInfo._id,
                        username:userInfo.username
                    }),{maxAge:86400*1000,httpOnly: false});
                    res.json(resData)
                }else{
                    resData.code=1;
                    resData.msg='密码错误';
                    res.json(resData)
                }
            })
        }else{
            resData.code=1;
            resData.msg='用户名不存在';
            res.json(resData)
        }
    })
});
//注册
router.post('/user/register',function(req,res,next){
    var username=req.body.username;
    var password=md5(req.body.password);
    User.findOne({
        username:username
    }).then(function(userInfo){
        if (userInfo) {
            // 如果有，说明被注册了
            resData={
                code:1,
                msg:'用户名已被注册'
            };
            res.json(resData);
            return 
        }else{
            // 没被注册就保存数据
            var user=new User({
                username:username,
                password:password
            });
            return user.save();
        }
    }).then(function(newUserInfo){
        resData.msg='注册成功';
        res.json(resData);
    });
});
//退出
router.post('/user/logout',function(req,res,next){
    req.cookies.set('userInfo',null);
    resData.msg='退出成功';
    res.json(resData)
});
//检查是否为管理员
router.post('/user/isAdmin',function(req,res,next){
    var username=req.body.username;
    User.findOne({
        username:username
    }).then(function(user){
        res.json({
            code:0,
            data:user
        })
    })
});
//检查用户名是否存在
router.post('/user/checkUsername',function(req,res,next){
    var username=req.body.username;
    User.findOne({
        username:username
    }).then(function(user){
        if (user) {
            res.json({
                code:1,
                msg:"应户名已存在"
            })
        }else{
            res.json({
                code:0,
                msg:"应户名不存在"
            })
        }

    })
});

 module.exports = router;