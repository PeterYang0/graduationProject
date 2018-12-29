/*
* @Author: 羊驼
* @Date:   2018-05-14 10:09:30
* @Last Modified by:   羊驼
* @Last Modified time: 2018-05-16 20:07:10
*/
import './index.css';
import 'pages/commons/nav/index.js';
import 'pages/commons/header/index.js';
import _mm from 'util/mm.js';
import _product from 'service/product-service.js';
import _cart from 'service/cart-service.js';
// import _cart from 'service/cart-service.js';
import template from './index.string';

var page={
	data:{
		productId : _mm.getUrlParam('productId') || '',
	},
	init:function(){
		this.onLoad();
		this.bindEvent();
	},
	onLoad:function(){
		//如果没有穿id自动回首页
		if (!this.data.productId) {
			_mm.goHome();
		}
		this.loadDetail();
	},
	//加载商品详情
	loadDetail:function(){
		var html='';
		var _this=this;
		_product.getProductDetail(this.data.productId,
			function(res){
				// 缓存res
				_this.data.detailInfo=res.data.product;
				var product=_this.filter(res);
				html=_mm.renderHtml(template,product);
				$('.page-wrap').html(html);
			},function(err){
				$('.page-wrap').html("<p class='errtips'>未找到该商品</p>");
			})
	},
	filter:function(res){
		res.data.product.productUrl=res.data.product.productUrl.substr(7);
		return res.data.product;
	},
	bindEvent:function(){
		var _this=this;
		//图片预览
		$(document).on('mouseenter','.p-img-item',function(){
			var imgUrl=$(this).find('.p-img').attr('src');
			$('.main-img').attr('src',imgUrl);
		});
		//加减
		$(document).on('click','.p-count-btn',function(){
			var type=$(this).hasClass('plus')?'plus':'minus';
			var count=$('.p-count').val()*1;
			var minCount=1;
			var maxCount=_this.data.detailInfo.productCount||1;
			if (type==='plus') {
				$('.p-count').val(count<maxCount?count+1:maxCount)
			}else{
				$('.p-count').val(count>1?count-1:minCount)
			}
		});
		//加入购物车
		$(document).on('click','.cart-add',function(){
			_cart.addToCart({
				productId:_this.data.productId,
				count:$('.p-count').val()*1
			},function(res){
				window.location.href='./result.html?type=cart-add';
			},function(err){
				_mm.errorTips(err)
			})
		})
	}
}
$(function(){
	page.init();
})