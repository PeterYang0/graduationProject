/*
* @Author: 羊驼
* @Date:   2018-12-26 11:12:35
* @Last Modified by:   羊驼
* @Last Modified time: 2018-12-26 22:37:15
*/
import './index.css';
import '../commons/header/index.js';//header组件
import '../commons/nav/index.js';//nav组件
import $ from 'jquery';

var page={
	init:function(){
		this.bindEvent();
	},
	bindEvent:function(){
		var _this=this;
		var index=0;
		$(document).on('click', '.lunbo .pre', function(event) {
			index-=1;
			if (index<0) {
				index=2
			}
			$('.lunbo ul.imgUl li').eq(index).show(400).siblings().hide(400);
			$('.lunbo ul.crileUl li').eq(index).css({
				'background':'#000'
			}).siblings().css({
				'background':'transparent'
			});
		});
		$(document).on('click', '.lunbo .next', function(event) {
			index+=1;
			if (index>2) {
				index=0
			}
			$('.lunbo ul.imgUl li').eq(index).show(400).siblings().hide(400);
			$('.lunbo ul.crileUl li').eq(index).css({
				'background':'#000'
			}).siblings().css({
				'background':'transparent'
			});
		});
		//定时器自动执行
		var timerFun=function(){
			index+=1;
			if (index>2) {
				index=0
			}
			$('.lunbo ul.imgUl li').eq(index).show(400).siblings().hide(400);
			$('.lunbo ul.crileUl li').eq(index).css({
				'background':'#000'
			}).siblings().css({
				'background':'transparent'
			});
		}
		var timer;
		timer=setInterval(timerFun,1000);
		//鼠标移入时清除定时器
		$(document).on('mouseenter', '.lunbo', function(event) {
			clearInterval(timer);
		});
		$(document).on('mouseleave', '.lunbo', function(event) {
			timer=setInterval(timerFun,1000);
		});
		$(document).on('click', '.lunbo ul.crileUl li', function(event) {
			index=$(this).index();
			$('.lunbo ul.imgUl li').eq(index).show(400).siblings().hide(400);
			$('.lunbo ul.crileUl li').eq(index).css({
				'background':'#000'
			}).siblings().css({
				'background':'transparent'
			});
		});

	}
}
$(function(){
	page.init();
})