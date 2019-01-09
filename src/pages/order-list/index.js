/*
* @Author: 羊驼
* @Date:   2018-05-17 16:57:32
* @Last Modified by:   羊驼
* @Last Modified time: 2018-05-19 20:10:01
*/
import './index.css';
import 'pages/commons/nav/index.js';
import 'pages/commons/header/index.js';
import _mm from 'util/mm.js';
import _order from 'service/order-service.js';
import template from './index.string';

var page={
	init:function(){
		this.loadOrderList();
	},
	loadOrderList:function(){
		var _this=this;
		var orderListHtml = '';
	    _order.getOrderList(function(res){
			if (res.code==10) {
				_mm.doLogin();
			}else if(res.code==0){
				_this.filter(res.data);
				console.log(res)
				orderListHtml = _mm.renderHtml(template, res.data);
				$('.order-list-con').html(orderListHtml);
			};
	    }, function(errMsg){
	        $('.order-list-con').html("<p class='errtips'>加载订单失败，请刷新</p>")
	    });
	},
	filter:function(data){
		console.log(data)
		if (data.orderList.length==0) {
			data.NotEmpty=false;
		}else{
			data.NotEmpty = true;
			for (var i = 0; i < data.orderList.length; i++) {
				data.orderList[i].orderCreateTime = new Date(data.orderList[i].orderCreateTime).toLocaleString();
			}
		}
		
	}
};

$(function(){
	page.init();
})