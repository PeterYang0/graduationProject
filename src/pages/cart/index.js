/*
* @Author: 羊驼
* @Date:   2018-05-14 19:07:50
* @Last Modified by:   羊驼
* @Last Modified time: 2018-05-17 16:02:50
*/
import './index.css';
import 'pages/commons/nav/index.js';
import 'pages/commons/header/index.js';
import _mm from 'util/mm.js';
import _product from 'service/product-service.js';
import _cart from 'service/cart-service.js';
import template from './index.string';
import _nav from 'pages/commons/nav/index.js';

var page={
	data:{

	},
	init:function(){
		this.onLoad();
		this.bindEvent();
	},
	onLoad:function(){
		this.loadCart();
	},
	bindEvent:function(){
		var _this=this;
		$(document).on('click','.cart-select',function(){

			var $this=$(this);
			// //商品的选择
			var productId=$(this).parents('.cart-table').data('prodcut_id');
			if ($this.is(':checked')) {
				_cart.selectProduct(productId,function(res){
					_this.renderCart(res.data);
				},function(){
					$('.page-wrap').html("<p class='errtips'>哪里不对，请重新刷新</p>")
				})
			}else{
				_cart.unselectProduct(productId,function(res){
					_this.renderCart(res.data)
				},function(){
					$('.page-wrap').html("<p class='errtips'>哪里不对，请重新刷新</p>")
				})
			}
		});
		//商品的全选
		$(document).on('click','.cart-select-all',function(){
			var $this=$(this);
			if ($(this).is(':checked')) {
				_cart.selectAllProduct(function(res){
					_this.renderCart(res.data)
				},function(){
					$('.page-wrap').html("<p class='errtips'>哪里不对，请重新刷新</p>")
				})
			}else{
				_cart.unselectAllProduct(function(res){
					_this.renderCart(res.data)
				},function(){
					$('.page-wrap').html("<p class='errtips'>哪里不对，请重新刷新</p>")
				})
			}
		});
		//数量
		$(document).on('click','.count-btn',function(){
			var $pcount=$(this).siblings('.count-input');
			var currtCount=$pcount.val()*1;
			var type=$(this).hasClass('plus')?'plus':'minus';
			var productId=$(this).parents('.cart-table').data('prodcut_id');
			var minCount=1;
			var maxCount=$pcount.data('max')*1;
			var newCount=0;
			if (type==='plus') {
				if (currtCount>=maxCount) {
					_mm.errorTips('该商品数量已达到上限');
					return
				}
				newCount=currtCount+1;
			}
			else if (type==='minus') {
				if (currtCount<=1) {
					return
				}
				newCount=currtCount-1;
			}
			_cart.updateProduct({
				productId:productId,
				count:newCount
			},function(res){
				_this.renderCart(res.data)
			},function(err){
				$('.page-wrap').html("<p class='errtips'>哪里不对，请重新刷新</p>")
			})
		});
		//删除单个商品
		$(document).on('click','.cart-delete',function(){
			if (window.confirm('是否要删除选中的商品')) {
				var productId=$(this).parents('.cart-table').data('prodcut_id');
				_this.delete(productId);
			}
		})
		//删除选中
		$(document).on('click','.delete-selected',function(){
			var productIds=[];
			if (window.confirm('是否要删除该商品')) {
				for (var i = 0; i <$('.cart-select:checked').length; i++) {
					productIds.push($($('.cart-select:checked')[i]).parents('.cart-table').data('prodcut_id'))
				}
				if (productIds.length) {
					_this.delete(productIds.join(','));
				}else{
					_mm.errorTips('您还没选择商品')
				}
				
			}
		});
		//提交购物车
		$(document).on('click','.submit-btn',function(){
			if (_this.data.cartInfo&&_this.data.cartInfo.cartTotalPrice>0) {
				window.location.href='./order-confirm.html'
			}else{
				_mm.errorTips('请选择商品后再提交')
			}
		})
	},
	//删除商品，支持批量，productId用，分割
	delete:function(productIds){
		var _this=this;
		_cart.deleteProduct(productIds,function(res){
			_this.renderCart(res.data)
		},function(){
			$('.page-wrap').html("<p class='errtips'>哪里不对，请重新刷新</p>")
		})
	},
	loadCart:function(){//加载购物车列表
		var _this=this;
		_cart.getCartList(function(res){
			if (res.code==10) {
				_mm.doLogin();
			}else{
				_this.renderCart(res.data);
			}
			
		},function(err){
			$('.page-wrap').html("<p class='errtips'>哪里不对，请重新刷新</p>")
		})
	},
	renderCart:function(data){//购物车页面
		this.filter(data);
		this.data.cartInfo = data;
		console.log(this.data.cartInfo)
		var CartHtml=_mm.renderHtml(template,data);
		$('.page-wrap').html(CartHtml);
		//修改导航条购物车数量
		_nav.loadCartCount();
	},
	filter:function(data){
		data.NotEmpty=!!data.cartList.length;
		data.cartTotalPrice = 0;
		data.allChecked = true;
		data.cartList.forEach(function(item){
			item.totalPrice = item.product.productNowprice * item.productNum;
			if (!item.checked) {
				data.allChecked = false;
			} else {
				data.cartTotalPrice += item.totalPrice;
			}
		});
	},

}
$(function(){
	page.init();
})
