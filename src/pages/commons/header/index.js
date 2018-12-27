/*
* @Author: 羊驼
* @Date:   2018-05-05 15:37:43
* @Last Modified by:   羊驼
* @Last Modified time: 2018-12-26 11:45:18
*/
import './index.css';

// import _mm from 'util/mm.js';

// var header={
// 	init:function(){
// 		this.bindEvent();
// 		this.onload();
// 	},
// 	onload:function(){
// 		var keyword=_mm.getUrlParam('keyword');
// 		if (keyword) {//有输入回填输入框
// 			$('#search-input').val(keyword);
// 		};
// 	},
// 	bindEvent:function(){
// 		var _this=this;
// 		//点击搜索按钮，搜索提交
// 		$('#search-btn').click(function() {
// 			_this.searchSubmit();
// 		});
// 		//输入回车也搜索
// 		$('#search-input').keyup(function(e){
// 			if (e.keyCode===13) {
// 				_this.searchSubmit();
// 			}
// 		})
// 	},
// 	//搜索的提交
// 	searchSubmit:function(){
// 		var keyword=$.trim($('#search-input').val());
// 		if (keyword) {//如果有输入就查询跳转
// 			window.location.href='./list.html?keyword='+keyword;
// 		}else{//无输入则返回首页
// 			_mm.goHome();
// 		}
// 	}

// };
// header.init();