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

//获取商品
router.get('/product/list',function(req,res,next){
    let product={};//参数product
    let products={}//存储所有的商品
    product.productStatus=true;
	let name=req.query.productName;
	let pageSize=req.query.pageSize*1?req.query.pageSize*1:15;
	let current=req.query.current*1?req.query.current*1:15;
	let skipCount=(current-1)*pageSize;
	let totalProduct;//总商品数
    let totalPage;//总页数
    let nameTotal;//该name商品的总数
	//算出总商品数
	Product.find({
        productStatus:true
    }).then(function(ps1){//获取到了所有的商品
        products=ps1;
		//条件搜索
		if (name) {
            product.productName={$regex:name};
            Product.find({
                productName:name,
                productStatus:true
            }).then(function(ps2){
                nameTotal=ps2.length;//该name商品的总数
            })
		};
		return Product.where(product)
			.limit(pageSize)
	        .skip(skipCount)
	        .populate(['productCat']);
	}).then(function(ps3){//只有十个
        if(name){//有搜索名
            totalProduct=nameTotal;
            totalPage=Math.ceil(totalProduct/pageSize);
        }else{//非搜索状态，
            totalProduct=products.length;
		    totalPage=Math.ceil(totalProduct/pageSize);
        }
		totalPage=Math.ceil(totalProduct/pageSize);
			res.json({
                code:0,
                data:{
                    products:ps3,
                    current:current,
                    totalPage:totalPage
                }
			});
		});
});
//获取商品详情
router.get('/product/detail',function(req,res,next){
    //获取商品id
    var id=req.query.productId;
    if(id){
        Product.findOne({
            _id:id
        }).then(function(product){
            if(product){
                res.json({
                    code:0,
                    data:{
                        product:product
                    }
                })
            }else{
                res.json({
                    code:0,
                    msg:'该商品不存在'
                })
            }
            
        })
    }
});

//购物车，加入购物车
router.get('/cart/add',function(req,res,next){
    //获取商品id
    var productId=req.query.productId;
    var count=parseInt(req.query.count);
    var productInfo;
    // console.log(productId,count)
    User.findOne({
        _id:req.userInfo._id
    }).then(function(user){
        user.cartList.forEach(function(element){
            if(element.product&&element.product==productId){
                element.productNum=parseInt(element.productNum)+count;
                productInfo=element;
            };
        });
        if(productInfo){
            // console.log('在');
            User.update({
                _id:req.userInfo._id
            },user).then(function(newdata){
                res.json({
                    code:0,
                    msg:'加入购物车成功',
                    data:newdata
                })
            });
        }else{
            // console.log('不在');
            Product.findOne({
                _id:productId
            }).then(function(product){
                product.productUrl=product.productUrl.substr(7)
                user.cartList.push({
                    product:product,
                    checked:true,
                    productNum:count
                });
                return User.update({
                    _id:req.userInfo._id
                },user)
            }).then(function(){
                res.json({
                    code:0,
                    msg:'加入购物车成功'
                })
            });
        }
    });
})
//获取购物车列表
router.get('/cart/cartlist',function(req,res,next){
    User.findOne({
        _id:req.userInfo._id
    }).then(function(user){
        res.json({
            code:0,
            data:{
                cartList:user.cartList
            }
        })
    })
})

 module.exports = router;