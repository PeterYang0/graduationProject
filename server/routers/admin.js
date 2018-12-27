/*
* @Author: 羊驼
* @Date:   2018-12-20 19:50:54
* @Last Modified by:   羊驼
* @Last Modified time: 2018-12-25 19:47:26
*/

var express=require('express');
var router=express.Router();

//商品库
var Product=require('../models/product');
//商品分类库
var ProductCat=require('../models/productCat');
var User=require('../models/user');

/*图片上传模块  即可以获取form表单的数据 也可以实现上传图片*/
var multiparty = require('multiparty'); 




//判断权限
router.use('/',function(req,res,next){
	if (!req.userInfo.isAdmin) {
		// res.send('对不起，您不是管理员，无法访问')
		res.redirect('/login')
		return 
	}else{
		next();
	};
});
//访问admin根目录
router.get('/',function(req,res,next){
	let productCount;
	let userCount;
	Product.find().then(function(products){
		productCount=products.length;
		return User.find();
	}).then(function(users){
		userCount=users.length;
		res.render('index',{
			userInfo:req.userInfo,
			userCount:userCount,
			productCount:productCount,
		});
	});
});
//商品列表
router.get('/product',function(req,res,next){
	let product={};
	let name=req.query.productName;
	let pageSize=req.query.pageSize*1?req.query.pageSize*1:4;
	let current=req.query.current*1?req.query.current*1:1;
	let skipCount=(current-1)*pageSize;
	let totalProduct;//总商品数
	let totalPage;//总页数
	//算出总商品数
	Product.find().then(function(products){
		totalProduct=products.length;
		totalPage=Math.ceil(totalProduct/pageSize);
		//条件搜索
		if (name) {
			product.productName={$regex:name};
			current=1;//不分页
			pageSize=totalProduct;
			totalPage=1;
			skipCount=0;
		};
		return Product.where(product)
			.limit(pageSize)
	        .skip(skipCount)
	        .populate(['productCat']);
	}).then(function(products){
			res.render('product',{
				userInfo:req.userInfo,
				products:products,
				current:current,
				totalPage:totalPage
			});
		});
});
//添加商品
router.post('/product/add',function(req,res){

    //获取表单的数据 以及post过来的图片

    var form = new multiparty.Form();

    form.uploadDir='upload'   //上传图片保存的地址     目录必须存在

    form.parse(req, function(err, fields, files) {
        
        var data={};
        data.productName=fields.productName[0];
        data.productDes=fields.productDes[0];
        data.productCat=fields.productCat[0];
        data.productStatus=fields.productStatus[0];
        data.productPrice=fields.productPrice[0];
        data.productCount=fields.productCount[0];
        data.productUrl=files.pic[0].path;
        //保存数据
        new Product(data).save().then(function(){
            res.redirect('/admin/product'); /*上传成功跳转到首页*/
        })
    });
});
//查看商品详情
router.get('/productDetail',function(req,res,next){
	var id=req.query.id;
	Product.findOne({
		_id:id
	}).populate(['productCat']).then(function(product){
		res.render('productDetail',{userInfo:req.userInfo,product:product});
	});
});
//编辑商品页面
router.get('/productEdit',function(req,res,next){
	var id=req.query.id;
	var product;
	Product.findOne({
		_id:id
	}).populate(['productCat']).then(function(prod){
		product=prod;
		return ProductCat.find();
	}).then(function(cat){
		res.render('productEdit',{
			userInfo:req.userInfo,
			product:product,
			productCats:cat
		});
	});
});
// 编辑商品页面信息
router.post('/product/edit',function(req,res,next){
    //获取表单的数据 以及post过来的图片
    var form = new multiparty.Form();
    form.uploadDir='upload'   //上传图片保存的地址     目录必须存在
    form.parse(req, function(err, fields, files) {
        var data={};
        var id=fields.productId[0];
        var productImg=fields.productImg[0];
        data.productName=fields.productName[0];
        data.productDes=fields.productDes[0];
        data.productCat=fields.productCat[0];
        data.productStatus=fields.productStatus[0];
        data.productPrice=fields.productPrice[0];
        data.productCount=fields.productCount[0];
        data.productUrl=files.pic[0].originalFilename?files.pic[0].path:productImg;
        //保存数据
        // 保存数据
        Product.update({
        	_id:id
        },data).then(function(){
        	res.redirect('/admin/product'); /*保存成功跳转到商品详情*/
        });
    });
});
//修改上架下架
router.post('/changeStatus',function(req,res,next){
	var id=req.body.id;
	var status=req.body.status;
	Product.update({
		_id:id
	},{
		productStatus:status
	}).then(function(){
		res.json({
			code:0,
			msg:'修改成功'
		})
	})
});
//删除商品
router.post('/deleteProduct',function(req,res,next){
	var id=req.body.id;
	Product.remove({
		_id:id
	}).then(function(){
		res.json({
			code:0,
			msg:'删除成功'
		})
	})
});
//添加商品
router.get('/addproduct',function(req,res,next){
	//查找所有分类
	ProductCat.find().then(function(productCats){
		res.render('addproduct',{userInfo:req.userInfo,productCats:productCats});
	});
});
//商品分类
router.get('/productCat',function(req,res,next){
	ProductCat.find().then(function(productCats){
		res.render('productCat',{userInfo:req.userInfo,productCats:productCats});
	});
});
//添加分类
router.post('/addProductCat',function(req,res,next){
	var Cat=req.body.productCat;
	ProductCat.findOne({
		productCat:Cat
	}).then(function(cat){
		if (cat) {
			res.json({
				code:1,
				msg:'该分类已存在'
			});
			return Promise.reject();
		}else{
			return new ProductCat({
						productCat:Cat
					}).save();
		}
	}).then(function(){
		res.json({
				code:0,
				msg:'添加分类成功'
			});
	});
});
//编辑分类
router.post('/editProductCat',function(req,res,next){
	var Cat=req.body.productCat;
	var id=req.body.id;
	
	ProductCat.update({
		_id:id
	},{
		productCat:Cat
	}).then(function(){
		res.json({
			code:0,
			msg:'修改分类成功'
		});
	});
	//商品的分类也要改变
	

});
//删除分类
router.post('/deleteProductCat',function(req,res,next){
	var id=req.body.id;//分类id
	//删除分类
	ProductCat.remove({
		_id:id
	}).then(function(){
		//删除该分类所以商品
		return Product.remove({
			productCat:id
		});
	}).then(function(){
		res.json({
			code:0,
			msg:'删除成功'
		});
	});
});


//用户模块---用户页面
router.get('/user',function(req,res,next){
	let user={};
	let username=req.query.username;
	let pageSize=req.query.pageSize*1?req.query.pageSize*1:10;
	let current=req.query.current*1?req.query.current*1:1;
	let skipCount=(current-1)*pageSize;
	let totalUser;//总商品数
	let totalPage;//总页数
	//算出总user
	User.find().then(function(users){
		totalUser=users.length;
		totalPage=Math.ceil(totalUser/pageSize);
		//条件搜索
		if (username) {
			user.username=username;
			totalPage=1;
		};
		return User.where(user)
			.limit(pageSize)
	        .skip(skipCount);
	}).then(function(users){
			res.render('user',{
				userInfo:req.userInfo,
				users:users,
				current:current,
				totalPage:totalPage
			});
		});
});
router.post('/deleteUser',function(req,res,next){
	let userId=req.body.id;
	if (userId) {
		User.remove({
			_id:userId
		}).then(function(){
			res.json({
				code:0,
				msg:'删除成功'
			});
		});
	};
	
});

module.exports=router;