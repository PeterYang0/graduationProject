/*
* @Author: 羊驼
* @Date:   2018-05-17 16:57:25
* @Last Modified by:   羊驼
* @Last Modified time: 2018-05-19 20:24:46
*/
import './index.css';
import 'pages/commons/nav/index.js';
import 'pages/commons/header/index.js';
import _mm from 'util/mm.js';
import _order from 'service/order-service.js';
import template from './index.string';

var page={
	data:{
		DetailParam:{
			orderNumber:_mm.getUrlParam('orderNumber'),
		}
	},
	init:function(){
		this.loadOrder();
		this.bindEvent();
	},
	bindEvent:function(){
		var _this=this;
		$(document).on('click','.cancel-btn',function(){
			if (window.confirm('确认取消吗')) {
				_order.cancelOrder(_this.data.DetailParam.orderNumber,function(res){
					_mm.successTips(res);
					_this.loadOrder();
				},function(err){
					_mm.errorTips(err);
				})	
			}
		})
	},
	loadOrder:function(){
		var _this=this;
	    var orderDetailHtml = '';
	    _order.getOrderDetail(this.data.DetailParam.orderNumber,function(res){
			_this.dataFilter(res.data);
			console.log(res)
	        orderDetailHtml = _mm.renderHtml(template, res.data);
	        $('.content').html(orderDetailHtml);
	    }, function(errMsg){
	        $('.content').html("<p class='errtips'>加载详情失败，请刷新</p>")
	    });
    },
    dataFilter:function(data){
		data.needPay = data.order.orderStatus==10;
		data.isCancel = data.order.orderStatus==10;
		data.order.orderCreateTime = new Date(data.order.orderCreateTime).toLocaleString();
    }
};

$(function(){
	page.init();
})