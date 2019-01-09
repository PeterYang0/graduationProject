/*
* @Author: Rosen
* @Date:   2017-05-17 18:55:04
* @Last Modified by:   羊驼
* @Last Modified time: 2018-05-19 20:23:08
*/

'use strict';

import _mm from 'util/mm.js';

var _order = {
    // 获取商品信息
    getProductList : function(resolve, reject){
        _mm.request({
            url     :'/api/order/getOrderCartProduct',
            success : resolve,
            error   : reject
        });
    },
    createOrder : function(info,resolve, reject){
        _mm.request({
            url     :'/api/order/createOrder',
            data 	: info,
            success : resolve,
            error   : reject
        });
    },
    getOrderList: function(resolve, reject){
        _mm.request({
            url     :'/api/order/orderList',
            success : resolve,
            error   : reject
        });
    },
    getOrderDetail:function(orderNo,resolve, reject){
         _mm.request({
            url    :'/api/order/orderItem',
            data    : {
                orderNo:orderNo
            },
            success : resolve,
            error   : reject
        });
    },
    cancelOrder:function(orderNo,resolve, reject){
         _mm.request({
            url     :'/api/order/cancelOrder',
            data    : {
                orderNo:orderNo
            },
            success : resolve,
            error   : reject
        });
    }
}
export default _order;