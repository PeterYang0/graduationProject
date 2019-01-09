/*
* @Author: Rosen
* @Date:   2017-05-17 18:55:04
* @Last Modified by:   羊驼
* @Last Modified time: 2018-05-18 20:31:13
*/

'use strict';

import _mm from 'util/mm.js';

var _adress = {
    // 获取地址列表
    getAdressList : function(resolve, reject){
        _mm.request({
            url: '/api/adress/getAdressList',
            data    : {
                pageNum  :1,
                pageSize :50
            },
            success : resolve,
            error   : reject
        });
    },
    //获取单条地址
    getAdress : function(id,resolve, reject){
        _mm.request({
            url: '/api/adress/getAdress',
            data    : {
                shippingId  :id
            },
            success : resolve,
            error   : reject
        });
    },
    save : function(info,resolve, reject){
        _mm.request({
            url: '/api/adress/addAdress',
            data    : info,
            success : resolve,
            error   : reject
        });
    },
    update : function(info,resolve, reject){
        _mm.request({
            url: '/api/adress/updateAdress',
            data    : info,
            success : resolve,
            error   : reject
        });
    },
    deleteAdress : function(id,resolve, reject){
        _mm.request({
            url: '/api/adress/deleteAdress',
            data    : {
                shippingId:id
            },
            success : resolve,
            error   : reject
        });
    }
}
export default _adress;