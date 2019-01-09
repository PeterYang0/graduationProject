/*
* @Author: 羊驼
* @Date:   2018-05-17 16:05:51
* @Last Modified by:   羊驼
* @Last Modified time: 2018-05-18 20:52:56
*/
import './index.css';
import 'pages/commons/nav/index.js';
import 'pages/commons/header/index.js';
import _mm 				from 'util/mm.js';
import templateAdress   from './adress.string';
import templateProduct  from './product.string';
import _adressModule    from './adress-module.js';
import _adress          from 'service/adress-service.js';
import _order           from 'service/order-service.js';

var page={
	data:{

	},
	init:function(){
		this.loadProduct();
		this.loadAdress();
		this.bindEvent();
	},
	bindEvent:function(){
		var _this=this;
		//选择地址
		$(document).on('click','.adress-item',function(){
			$(this).addClass('active').siblings('.adress-item').removeClass('active');
			_this.data.selectAdressId=$(this).data('id');
		});
		//新增地址
		$(document).on('click','.adress-add',function(){
			_adressModule.show({
				isUpdate:false,
				onSuccess:function(){
					_this.loadAdress();
				}
			})
		});
		//编辑地址
		$(document).on('click','.adress-update',function(e){
			e.stopPropagation();
			var shippingId = $(this).parents('.adress-item').data('id');
			_adress.getAdress(shippingId,function(res){
				_adressModule.show({
					isUpdate:true,
					data:res.data,
					onSuccess:function(){
					_this.loadAdress();
				}
				})
			},function(err){
				_mm.errorTips(err)
			})
		});
		//删除地址
		$(document).on('click','.adress-delete',function(e){
			e.stopPropagation();
			var id=$(this).parents('.adress-item').data('id');
			if (window.confirm('确认要删除吗？')) {
				_adress.deleteAdress(id,function(res){
					_this.loadAdress();
				},function(err){
					_mm.errorTips(err)
				})
			}
		});
		//提交订单
		$(document).on('click','.submit-order',function(){
			var shippingId = _this.data.selectAdressId;
			if (shippingId) {
				_order.createOrder({
					shippingId:shippingId
				},function(res){
						window.location.href = './payment.html?orderNum=' + res.data.orderNumber;
					alert('成功')
				},function(err){
					_mm.errorTips('err')
				})
			}else{
				_mm.errorTips('请先选择地址')
			}
		})
	},
	//加载商品
	loadProduct:function(){
		var _this=this;
		_order.getProductList(function(res){
			_this.prodcutFilter(res.data)
			console.log(res.data)
			var ProductHtml=_mm.renderHtml(templateProduct,res.data);
			$('.product-con').html(ProductHtml);
		},function(err){
			$('.product-con').html("<p class='errtips'>商品加载失败，请重新刷新</p>");
		})
	},
	//加载地址列表
	loadAdress:function(){
		var _this=this;
		_adress.getAdressList(function(res){
			_this.addressfilter(res);
			var AdressHtml=_mm.renderHtml(templateAdress,res.data);
			$('.adress-con').html(AdressHtml);
		},function(err){
			$('.adress-con').html("<p class='errtips'>地址加载失败，请重新刷新</p>");
		})
	},
	prodcutFilter:function(data){
		data.productTotalPrice=0;
		for (let index = 0; index < data.productList.length; index++) {
			data.productList[index].totalPrice = data.productList[index].product.productNowprice * data.productList[index].productNum
			data.productTotalPrice += data.productList[index].totalPrice
		};
	},
	addressfilter:function(res){
		console.log(res)
		if (this.data.selectAdressId) {
			var flg=false;
			for (var i = 0; i < res.data.adressList.length; i++) {
				if (res.data.adressList[i].adressId==this.data.selectAdressId) {
					res.data.adressList[i].isActive=true;
					flg=true;
				}
			};
			if (!flg) {//如果不在，就删除id
				this.data.selectAdressId=null
			}
		}
	}
}
$(function(){
	page.init();
})