/*
* @Author: 羊驼
* @Date:   2018-05-06 22:13:36
* @Last Modified by:   羊驼
* @Last Modified time: 2018-12-26 21:28:42
*/
import './index.css';
import 'pages/commons/nav-simple/index.js';
import _mm     from 'util/mm.js';
import _user   from 'service/user-service.js';
import $ from 'jquery';

//错误提示
var fromError={
	show:function(err){
		$('.error-item').show().find('.err-msg').text(err);
	},
	hide:function(err){
		$('.error-item').hide().find('.err-msg').text(err);
	}
}

//page部分
var page={
	init:function(){
		this.bindEvent();
	},
	bindEvent:function(){
		var _this=this;
		//验证username
		$('#username').blur(function(){
			var username=$.trim($(this).val());
			if (!username) {
				return;
			}
			//异步验证username是否存在
			_user.checkUsername(username,function(res){
				if (res.code==1) {//用户名已存在
					fromError.show(res.msg);
				}else if(res.code==0){//用户名不存在
					fromError.hide();
				}
			},function(err){
				fromError.show(err)
			})
		});
		//注册
		$('#submit').click(function() {
			_this.submit();
		});
		$('.user-content').keyup(function(event) {
			if (event.keyCode===13) {
				_this.submit();
			}
		});
	},
	submit:function(){
		var fromData={
			username  : $.trim($('#username').val()),
			password  : $.trim($('#password').val()),
			again     : $.trim($('#again').val()),
		};
		//表单验证结果
		var validateResult=this.fromValiDate(fromData);
		//验证成功
		if (validateResult.status) {
			_user.register(fromData,function(res){
				if (res.code==0) {
					window.location.href='./result.html?type=register';
				}
			},function(err){
				fromError.show(err)
			});
		}else{//验证失败
			fromError.show(validateResult.msg)// 错误提示
		}
		
		
	},
	// 表单验证
	fromValiDate:function(fromData){
		var result={
			status:false,
			msg:''
		};
		if (!_mm.validata(fromData.username,'require')) {
			result.msg='用户名不能为空';
			return result;
		}
		if (!_mm.validata(fromData.password,'require')) {
			result.msg='密码不能为空';
			return result;
		}
		if (fromData.password.length<6) {
			result.msg='密码不能少于6位';
			return result;
		}
		if (fromData.password !== fromData.again) {
			result.msg='两次密码不一致';
			return result;
		}
		//验证成功
		result.status=true;
		result.msg='验证通过';
		return result;
	}
}
$(function(){
	page.init();
})