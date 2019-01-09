/*
* @Author: Rosen
* @Date:   2017-05-27 18:26:52
* @Last Modified by:   羊驼
* @Last Modified time: 2018-05-12 11:10:18
*/

import _mm from 'util/mm.js';

var _product = {
    // 获取商品列表
    getProductList : function(listParam, resolve, reject){
        _mm.request({
            url     : '/api/product/list',
            data    : listParam,
            success : resolve,
            error   : reject
        });
    },
    // // 获取商品详细信息
    getProductDetail : function(productId, resolve, reject){
        _mm.request({
            url     :'/api/product/detail',
            data    : {
                productId : productId
            },
            success : resolve,
            error   : reject
        });
    },
    //获取分类
    getProductCat: function ( resolve, reject) {
        _mm.request({
            url: '/api/product/productCat',
            success: resolve,
            error: reject
        });
    },
    //分类的产品
    getCatProduct: function (data,resolve, reject) {
        _mm.request({
            url: '/api/product/catProduct',
            method:'post',
            data:data,
            success: resolve,
            error: reject
        });
    },
    //促销商品
    getDiscountProduct: function (data, resolve, reject) {
        _mm.request({
            url: '/api/product/DiscountProduct',
            data: data,
            success: resolve,
            error: reject
        });
    }
}
export default _product;