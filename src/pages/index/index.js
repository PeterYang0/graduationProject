/*
* @Author: 羊驼
* @Date:   2018-12-26 11:12:35
* @Last Modified by:   羊驼
* @Last Modified time: 2018-12-26 22:37:15
*/
import './index.css';
import 'util/jqueryPagination/css/jquery.pagination.css';
import 'util/jqueryPagination/js/jquery.pagination.min.js';
import _mm     from 'util/mm.js';
import _product  from 'service/product-service.js';
import '../commons/header/index.js';//header组件
import '../commons/nav/index.js';//nav组件
import template from './index.string';//html模板


var page={
	init:function(){
		this.bindEvent();
		this.onLoad();
	},
	onLoad:function(){
		var productName=_mm.getUrlParam('productName');
		if (productName) {//有输入回填输入框
			$('#search-input').val(productName);
		};
		this.loadProductList(1,productName);
	},
	loadProductList:function(page,productName){//加载商品列表
		var _this=this;
		var data={};
		if(productName){
			data.productName=productName
		}
		data.pageSize=10;
		data.current=page;
		_product.getProductList(data,function(res){
			if(res.code==0){
				//请求成功渲染模板
				for(var i=0;i<res.data.products.length;i++){
					res.data.products[i].productUrl=res.data.products[i].productUrl.substr(7);
				}
				var listHtml=_mm.renderHtml(template,{
					products:res.data.products
				});
				$('.list').html(listHtml);
				//初始化分页插件
				_this.initPagination(res.data.current,res.data.totalPage);
			};
		},function(err){
			alert('商品加载失败')
		})
	},
	initPagination:function(currentPage,totalPage){
		var _this=this;
		//初始化分页插件
		$("#pagination1").pagination({
			currentPage: currentPage,
			totalPage: totalPage,
			callback: function(current) {
				_this.pageInfo(current)
			}
		});
	},
	pageInfo:function(page){
		this.loadProductList(page);
	},
	bindEvent:function(){
		// 轮播图部分
		var _this=this;
		var index=0;
		$(document).on('click', '.lunbo .pre', function(event) {//上一张图片
			index-=1;
			if (index<0) {
				index=2
			}
			$('.lunbo ul.imgUl').animate({
				'marginLeft':index*(-1080)+'px'
			},500);
			$('.lunbo ul.crileUl li').eq(index).addClass('active').siblings().removeClass('active');
		});
		$(document).on('click', '.lunbo .next', function(event) {
			index+=1;
			if (index>2) {
				index=0
			}
			$('.lunbo ul.imgUl').animate({
				'marginLeft':index*(-1080)+'px'
			},500);
			$('.lunbo ul.crileUl li').eq(index).addClass('active').siblings().removeClass('active');
		});
		//定时器自动执行
		var timerFun=function(){
			index+=1;
			if (index>2) {
				index=0
			}
			$('.lunbo ul.imgUl').animate({
				'marginLeft':index*(-1080)+'px'
			},500);
			$('.lunbo ul.crileUl li').eq(index).addClass('active').siblings().removeClass('active');
		}
		var timer;
		timer=setInterval(timerFun,3000);
		//鼠标移入时清除定时器
		$(document).on('mouseenter', '.lunbo', function(event) {
			clearInterval(timer);
		});
		$(document).on('mouseleave', '.lunbo', function(event) {
			timer=setInterval(timerFun,3000);
		});
		$(document).on('click', '.lunbo ul.crileUl li', function(event) {
			index=$(this).index();
			$('.lunbo ul.imgUl').animate({
				'marginLeft':index*(-1080)+'px'
			},500);
			$('.lunbo ul.crileUl li').eq(index).addClass('active').siblings().removeClass('active');
		});

	}
}
$(function(){
	page.init();
})