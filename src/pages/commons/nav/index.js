/*
* @Author: 羊驼
* @Date:   2018-05-05 11:24:33
* @Last Modified by:   羊驼
* @Last Modified time: 2018-12-26 20:59:32
*/
import './index.css';

import _mm  from 'util/mm.js';
import $ from 'jquery';
//引入jq.cookie插件
import 'util/jquery.cookie.js';
import _user   from 'service/user-service.js';
import _cart from 'service/cart-service.js';
// // 导航
var nav = {
    init : function(){
        this.bindEvent();
        this.loadUserInfo();
        this.loadCartCount();
        return this;
    },
    bindEvent : function(){
        // 登录点击事件
        $('.js-login').click(function(){
            _mm.doLogin();
        });
        // 注册点击事件
        $('.js-register').click(function(){
            window.location.href = './user-register.html';
        });
        // 退出点击事件
        $('.js-logout').click(function(){
            _user.logout(function(res){
                window.location.reload();
            }, function(errMsg){
                _mm.errorTips(errMsg);
            });
        });
    },
    // 加载用户信息
    loadUserInfo : function(){
        var userInfo={};
        if ($.cookie("userInfo")) {
            userInfo=$.parseJSON($.cookie("userInfo"));
        };
        var username=userInfo.username||'';
        var isAdmin;
        if (username) {
            $('.user.not-login').hide().siblings('.user.login').show().find('.username').text(username);
            _user.isAdmin(username,function(res){
                //判断身份
                isAdmin=res.data.isAdmin;
                if (isAdmin) {
                    $('.isAdmin').show();
                }else{
                    $('.isAdmin').hide();
                }
                //加载购物车数量
                
                
            },function(err){
                alert('请求出错')
            })
        }else{
            $('.user.not-login').show().siblings('.user.login').hide()
        };
    },
    loadCartCount:function () {
        _cart.getCartCount(function (res) {
            if(res.code==10){
                _mm.doLogin();
            }else{
                var cartListCount = res.data.cartCount;
                $('.nav .cart-count').text(cartListCount);
            }
            
        },function(err){
            alert('网络出错')
        });
    }
};
module.exports = nav.init();