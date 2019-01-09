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
var ProductCat=require('../models/productCat');
var User=require('../models/user');
var Order = require('../models/order');




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
//获取分类
router.get('/product/productCat', function (req, res, next){
    ProductCat.find().then(function(cates){
        res.json({
            code:0,
            data:{
                cates:cates
            }
        });
    });
});
//分类商品
router.post('/product/catProduct', function (req, res, next) {
    var obj={};
    var id = req.body.cateId;
    if (id != '') {
        obj.productCat = id
    };
    console.log(obj)
    let pageSize = req.body.pageSize * 1 ? req.body.pageSize * 1 : 10;
    let current = req.body.current * 1 ? req.body.current * 1 : 1;
    let skipCount = (current - 1) * pageSize;
    let totalProduct;//总商品数
    let totalPage;//总页数
    Product.where(obj).then(function (products) {
        totalProduct = products.length;
        totalPage = Math.ceil(totalProduct / pageSize);
        return Product.where(obj).limit(pageSize).skip(skipCount)
    }).then(function(p){
        res.json({
            code: 0,
            data: {
                current: current,
                products: p,
                totalPage: totalPage
            }
        });
    });
});
//促销商品
router.get('/product/DiscountProduct', function (req, res, next){
    let pageSize = req.query.pageSize * 1 ? req.query.pageSize * 1 : 10;
    let current = req.query.current * 1 ? req.query.current * 1 : 1;
    let skipCount = (current - 1) * pageSize;
    let totalProduct;//总商品数
    let totalPage;//总页数
    //算出总商品数
    Product.find({ productDiscount: { $lt: 10 } }).then(function (products) {
        totalProduct = products.length;
        totalPage = Math.ceil(totalProduct / pageSize);
        //条件搜索
        return Product.find({ productDiscount: { $lt: 10 } })
            .limit(pageSize)
            .skip(skipCount)
            .populate(['productCat']);
    }).then(function (products) {
        res.json({
            code:0,
            data:{
                products: products,
                current: current,
                totalPage: totalPage
            }
        });
    });
});
//获取商品
router.get('/product/list',function(req,res,next){
    let product={};//参数product
    let products={}//存储所有的商品
    product.productStatus=true;
	let name=req.query.productName;
	let pageSize=req.query.pageSize*1?req.query.pageSize*1:10;
	let current=req.query.current*1?req.query.current*1:1;
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
//查询购物车数量
router.get('/cart/count', function (req, res, next) {
    if (req.userInfo.username) {
        User.findOne({
            _id: req.userInfo._id
        }).then(function (user) {
            res.json({
                code: 0,
                data: {
                    cartCount: user.cartList.length
                }
            })
        })
    }else{
        res.json({
            code: 1,
            msg:'未登录',
            data: {
                cartCount: 0
            }
        })
    }
    
})
//购物车，加入购物车
router.get('/cart/add',function(req,res,next){
    //获取商品id
    var productId=req.query.productId;
    var count=parseInt(req.query.count);
    var productInfo;
    User.findOne({
        _id:req.userInfo._id
    }).then(function(user){
        user.cartList.forEach(function(element){
            if(element.product&&element.product._id==productId){
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
    if (req.userInfo.username) {
        User.findOne({
            _id: req.userInfo._id
        }).then(function (user) {
            res.json({
                code: 0,
                data: {
                    cartList: user.cartList
                }
            })
        })
    } else {
        res.json({
            code: 10,
            msg: '未登录'
        })
    }
    
})
//取消购物车列表所有商品的勾选
router.get('/cart/un_select_all', function (req, res, next) {
    var userCartInfo;
    User.findOne({
        _id: req.userInfo._id
    }).then(function (user) {
        user.cartList.forEach(function(item){
            item.checked=false;
        });
        userCartInfo=user;
        return User.update({
            _id: req.userInfo._id
        }, userCartInfo);
    }).then(function(){
        res.json({
            code: 0,
            data: {
                cartList: userCartInfo.cartList
            }
        })
    })
})
//打开购物车列表所有商品的勾选
router.get('/cart/select_all', function (req, res, next) {
    var userCartInfo;
    User.findOne({
        _id: req.userInfo._id
    }).then(function (user) {
        user.cartList.forEach(function (item) {
            item.checked = true;
        });
        userCartInfo = user;
        return User.update({
            _id: req.userInfo._id
        }, userCartInfo);
    }).then(function(){
        res.json({
            code: 0,
            data: {
                cartList: userCartInfo.cartList
            }
        })
    })
});
// 选择购物车商品
router.get('/cart/select', function (req, res, next) {
    var userInfo;
    var id=req.query.productId;
    User.findOne({
        _id: req.userInfo._id
    }).then(function (user) {
        user.cartList.forEach(function (item) {
            if (item.product._id == id){
                item.checked=true
            }
        });
        userInfo = user;
        return User.update({
            _id: req.userInfo._id
        }, userInfo);
    }).then(function () {
        res.json({
            code: 0,
            data: {
                cartList: userInfo.cartList
            }
        })
    })
});
// 取消选择购物车商品
router.get('/cart/un_select', function (req, res, next) {
    var userInfo;
    var id = req.query.productId;
    User.findOne({
        _id: req.userInfo._id
    }).then(function (user) {
        user.cartList.forEach(function (item) {
            if (item.product._id == id) {
                item.checked = false
            }
        });
        userInfo = user;
        return User.update({
            _id: req.userInfo._id
        }, userInfo);
    }).then(function () {
        res.json({
            code: 0,
            data: {
                cartList: userInfo.cartList
            }
        })
    })
});
//更改购物车数量
router.get('/cart/update', function (req, res, next) {
    var userInfo;
    var id = req.query.productId;
    var count = req.query.count;
    User.findOne({
        _id: req.userInfo._id
    }).then(function (user) {
        user.cartList.forEach(function (item) {
            if (item.product._id == id) {
                item.productNum = parseInt(count);
            }
        });
        userInfo = user;
        return User.update({
            _id: req.userInfo._id
        }, userInfo);
    }).then(function () {
        res.json({
            code: 0,
            data: {
                cartList: userInfo.cartList
            }
        })
    })
});
//删除购物车的商品
router.get('/cart/delete_product', function (req, res, next) {
    var userInfo;
    var newCartList=[];
    var id = req.query.productIds;
    var idArr = id.split(",");
    User.findOne({
        _id: req.userInfo._id
    }).then(function (user) {
        if (user.cartList.length == idArr.length) {
            user.cartList = [];
        }else{
            for (var i = user.cartList.length - 1; i >= 0; i--) {
                for (var j = 0; j < idArr.length; j++) {
                    if (user.cartList.length > 0) {
                        var goodsId = user.cartList[i].product._id;
                        if (goodsId == idArr[j]) {
                            user.cartList.splice(i, 1)
                        };
                    }
                }
            };
        };
        userInfo = user;
        return User.update({
            _id: req.userInfo._id
        }, userInfo);
    }).then(function () {
        res.json({
            code: 0,
            data: {
                cartList: userInfo.cartList
            }
        })
    })
});
//添加地址
router.get('/adress/addAdress', function (req, res, next) {
    var userInfo={};
    var adressData={};
    adressData.adressId = new Date().getTime();
    adressData.receiverName = req.query.receiverName;
    adressData.receiverPhone = req.query.receiverPhone;
    adressData.receiverProvince = req.query.receiverProvince;
    adressData.receiverCity = req.query.receiverCity;
    adressData.receiverAdress = req.query.receiverAdress; 
    adressData.receiverZip = req.query.receiverZip; 
    User.findOne({
        _id:req.userInfo._id
    }).then(function (user) {
        user.adressList.push(adressData);
        userInfo = user;
        return User.update({
            _id: req.userInfo._id
        }, userInfo);
    }).then(function(){
        res.json({
            code:0,
            msg:'新建地址成功'
        })
    });
});
//获取地址列表
router.get('/adress/getAdressList', function (req, res, next) {
    User.findOne({
        _id:req.userInfo._id
    }).then(function (user) {
        res.json({
            code: 0,
            data: {
                adressList: user.adressList
            }
        })
    });
});
//删除地址
router.get('/adress/deleteAdress', function (req, res, next) {
    var newUser;
    var adressId = req.query.shippingId;
    User.findOne({
        _id: req.userInfo._id
    }).then(function (user) {
        user.adressList.forEach(function(item,index){
            if (adressId == item.adressId) {
                user.adressList.splice(index,1)
            }
        });
        newUser = user
        return User.update({
            _id: req.userInfo._id
        }, newUser);
    }).then(function(){
        res.json({
            code: 0,
            msg:'删除成功'
        })
    });
});
//编辑地址
router.get('/adress/updateAdress', function (req, res, next) {
    var newUser;
    var adressId = req.query.id;
    console.log(adressId)
    var adressData = {};
    adressData.receiverName = req.query.receiverName;
    adressData.receiverPhone = req.query.receiverPhone;
    adressData.receiverProvince = req.query.receiverProvince;
    adressData.receiverCity = req.query.receiverCity;
    adressData.receiverAdress = req.query.receiverAdress;
    adressData.receiverZip = req.query.receiverZip;
    User.findOne({
        _id: req.userInfo._id
    }).then(function (user) {
        user.adressList.forEach(function (item, index) {
            if (adressId == item.adressId) {
                adressData.adressId = adressId;
                user.adressList[index] = adressData;
            }
        });
        newUser = user
        return User.update({
            _id: req.userInfo._id
        }, newUser);
    }).then(function () {
        res.json({
            code: 0,
            msg: '编辑成功'
        })
    });
});

//获取单条地址
router.get('/adress/getAdress', function (req, res, next) {
    var adress={};
    var adressId = req.query.shippingId;
    User.findOne({
        _id: req.userInfo._id
    }).then(function (user) {
        user.adressList.forEach(function (item, index) {
            if (adressId == item.adressId) {
                adress=item;
            }
        });
        res.json({
            code: 0,
            data: adress
        })
    });
});

//确认订单加载商品
router.get('/order/getOrderCartProduct', function (req, res, next) {
    var productList=[];
    User.findOne({
        _id: req.userInfo._id
    }).then(function (user) {
        user.cartList.forEach(function (item, index) {
            if (item.checked) {
                productList.push(item)
            }
        });
        res.json({
            code: 0,
            data:{
                productList: productList
            }
        })
    });
});
//创建订单
router.get('/order/createOrder', function (req, res, next) {
    var adressId = req.query.shippingId;
    var orderData = {};
    orderData.orderProduct=[];
    orderData.orderTotalPrice=0;
    orderData.orderId = new Date().getTime();
    orderData.orderPayment = '在线支付';
    orderData.orderCreateTime = new Date().getTime();
    orderData.orderStatus=10;//默认未支付
    if (orderData.orderStatus==10) {
        orderData.orderStatusDec='未支付'
    };
    var idArr=[];//存储购物车选中的id
    User.findOne({
        _id: req.userInfo._id
    }).then(function (user) {
        orderData.username=user.username;
        user.cartList.forEach(function(item){
            if (item.checked) {
                idArr.push(item.product._id)
                orderData.orderProduct.push({
                    product: item.product,
                    productNum: item.productNum,
                    totalPrice: item.product.productNowprice * item.productNum
                })
                orderData.orderTotalPrice += item.product.productNowprice * item.productNum
            };
        })
        user.adressList.forEach(function(item){
            if (adressId == item.adressId) {
                orderData.orderAdress=item;
            }
        });
        new Order(orderData).save().then(function () {
            res.json({
                code:0,
                data:{
                    orderNumber: orderData.orderId
                }
            });
        })
    });
    //删除购物车选中的商品
    var userInfo;
    User.findOne({
        _id: req.userInfo._id
    }).then(function (user) {
        if (user.cartList.length == idArr.length) {
            user.cartList = [];
        } else {
            for (var i = user.cartList.length - 1; i >= 0; i--) {
                for (var j = 0; j < idArr.length; j++) {
                    if (user.cartList.length > 0) {
                        var goodsId = user.cartList[i].product._id;
                        if (goodsId == idArr[j]) {
                            user.cartList.splice(i, 1)
                        };
                    }
                }
            };
        };
        userInfo = user;
        return User.update({
            _id: req.userInfo._id
        }, userInfo);
    }).then(function () {
        return
    })
});
//加载订单列表
router.get('/order/orderList', function (req, res, next) {
    if (req.userInfo.username) {
        Order.find({
            username:req.userInfo.username
        }).sort({
            'orderCreateTime':-1
        }).then(function(orders){
            res.json({
                code:0,
                data:{
                    orderList: orders
                }
            })
        })
    }else{
        res.json({
            code:10,
            msg:'未登录'
        })
    }
});
//查看订单详情
router.get('/order/orderItem', function (req, res, next) {
    var orderId = req.query.orderNo
    if (req.userInfo.username) {
        Order.findOne({
            orderId: orderId
        }).then(function (order) {
            res.json({
                code: 0,
                data: {
                    order: order
                }
            })
        })
    } else {
        res.json({
            code: 10,
            msg: '未登录'
        })
    }
});
//取消订单
router.get('/order/cancelOrder', function (req, res, next) {
    var orderId = req.query.orderNo;

    if (req.userInfo.username) {
        Order.findOne({
            orderId: orderId
        }).then(function (order) {
            order.orderStatus=20;
            order.orderStatusDec='已取消';
            order.save();
            res.json({
                code: 0,
                data: {
                    order: order
                }
            })
        })
    } else {
        res.json({
            code: 10,
            msg: '未登录'
        })
    }
});


 module.exports = router;