/*
* @Author: 羊驼
* @Date:   2018-12-26 13:38:25
* @Last Modified by:   羊驼
* @Last Modified time: 2018-12-26 21:28:02
*/
import _mm from 'util/mm.js';

var _user = {
    // 用户登录
    login : function(userInfo, resolve, reject){
        _mm.request({
            url     :'/api/user/login',
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    //检查是否为管理员
    isAdmin : function(username, resolve, reject){
        _mm.request({
            url     : '/api/user/isAdmin',
            data    : {
                username    : username
            },
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    //检查用户名是否存在
    checkUsername:function(username, resolve, reject){
        _mm.request({
            url     : '/api/user/checkUsername',
            data    : {
                username    : username
            },
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 用户注册
    register : function(userInfo, resolve, reject){
        _mm.request({
            url     : '/api/user/register',
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 退出
    logout : function(resolve, reject){
        _mm.request({
            url     : '/api/user/logout',
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    }
}
module.exports = _user;
