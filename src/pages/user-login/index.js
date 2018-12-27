/*
* @Author: 羊驼
* @Date:   2018-12-26 13:41:02
* @Last Modified by:   羊驼
* @Last Modified time: 2018-12-26 18:09:27
*/
import './index.css';
import '../commons/nav-simple/index.js';
import $ from 'jquery';
import _mm     from 'util/mm.js';
import _user   from 'service/user-service.js';


//错误提示
var fromError={
	show:function(err){
		$('.error-item').show().find('.err-msg').text(err);
	},
	hide:function(err){
		$('.error-item').hide().find('.err-msg').text(err);
	}
}
//页面page
var page={
	init:function(){
		this.bindEvent();
	},
	bindEvent:function(){
		var _this=this;
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
			username:$.trim($('#username').val()),
			password:$.trim($('#password').val())
		};
		//表单验证结果
		var validateResult=this.fromValiDate(fromData);
		//验证成功
		if (validateResult.status) {
			_user.login(fromData,function(res){
				if (res.code==0) {
					window.location.href=_mm.getUrlParam('redirect')||'./index.html';
				}else{
					fromError.show(res.msg)
				}
			},function(err){
				fromError.show(err)
			})
		}
		else{//验证失败
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
		//验证成功
		result.status=true;
		result.msg='验证通过';
		return result;
	}
};

page.init();
