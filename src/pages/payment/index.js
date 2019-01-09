/*
* @Author: 羊驼
* @Date:   2018-05-19 20:31:11
* @Last Modified by:   羊驼
* @Last Modified time: 2018-05-19 21:03:49
*/
import './index.css';
import 'pages/commons/nav/index.js';
import 'pages/commons/header/index.js';
import _mm from 'util/mm.js';
var page={
	data:{
	},
	init:function(){
		this.bidEvent();
	},
	bidEvent:function(){
		this.data.orderNo=_mm.getUrlParam('orderNum')||'********';
		$('.orderNo').html(this.data.orderNo);
	}
};

$(function(){
	page.init();
})