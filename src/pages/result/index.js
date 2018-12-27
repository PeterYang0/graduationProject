/*
* @Author: 羊驼
* @Date:   2018-05-05 20:15:11
* @Last Modified by:   羊驼
* @Last Modified time: 2018-12-26 21:30:13
*/
import './index.css';
import 'pages/commons/nav-simple/index.js'
import _mm from 'util/mm.js';
import $ from 'jquery';

$(function(){
	var type=_mm.getUrlParam('type')||'default';
	var $element=$('.'+type+'-success');
	$element.show();
})