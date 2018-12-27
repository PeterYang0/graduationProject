/*
* @Author: 羊驼
* @Date:   2018-12-26 11:48:38
* @Last Modified by:   羊驼
* @Last Modified time: 2018-12-26 17:14:21
*/
import Hogan from 'hogan.js';
import $ from 'jquery';

var mm={
	// 网络请求
	request:function(param){
		var _this=this;
		$.ajax({
			type 	 :param.method || 'get',
			url  	 :param.url    || '',
			datatype :param.type   || 'json',
			data 	 :param.data   || '',
			success:function(res){
				param.success(res);
			},
			error:function(err){
				param.error(err);
			}
		})
	},
	doLogin:function(){
		window.location.href='./user-login.html?redirect='+encodeURIComponent(window.location.href);
	},
	goHome:function(){
		window.location.href='./index.html';
	},
	renderHtml:function(templateHtml,data){
		var tem=Hogan.compile(templateHtml),
		result=tem.render(data);
		return result
	},
	successTips:function(res){
		alert(res||'操作成功')
	},
	errorTips:function(err){
		alert(err||'操作失败')
	},
	//字段的验证 支持非空，手机，邮箱
	validata:function(value,type){
		var value=$.trim(value);
		if (type==='require') {
			return !!value;//强制转化为boolean值
		}
		if (type==='phone') {
			return /^1\d{10}$/.test(value);
		}
		if (type==='email') {
			return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
		}
	},
	//获取url参数
	getUrlParam:function(name){
		//happymmall.com/product/list.do?key=1$val=2
		var reg=new RegExp('(^|&)'+name+'=([^&]*)(&|$)');
		var result =window.location.search.substr(1).match(reg);
		return result ? decodeURIComponent(result[2]):null;
	},
    setStorage:function(name,data){
        var datatype=typeof data;
        if (datatype=='object') {
            localStorage.setItem(name,JSON.stringify(data))
        }else if(['number','boolean','string'].indexof(datatype)>=0){
            localStorage.setItem(name,data)
        }else{
            alert('该类型不适用于本地存储')
        }
	},
    getStorage:function(name){
        var data =window.localStorage.getItem(name)
        if(data){
            return JSON.parse(data);
        }else{
            return ''
        }
    },
    removeStorage:function(name){
        window.localStorage.removeItem(name)
    }
};

export default mm;