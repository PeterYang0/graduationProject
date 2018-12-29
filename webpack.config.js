/*
* @Author: 羊驼
* @Date:   2018-12-01 21:03:14
* @Last Modified by:   羊驼
* @Last Modified time: 2018-12-26 21:18:20
*/
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

//html模板的配置
var getHtmlConfig = function(name, title){
    return {
        template    : './src/views/' + name + '.html',
        filename    : 'views/' + name + '.html',
        title       : title,
        inject      : true,
        hash        : true,
        chunks      : ['commons', name],
        favicon     : './favicon.ico'
    };
};


module.exports = {
  entry: {
    'commons'         :   ['./src/pages/commons/index.js'],
    'index'           :   ['./src/pages/index/index.js'],
    'user-login'      :   ['./src/pages/user-login/index.js'],
    'user-register'   :   ['./src/pages/user-register/index.js'],
    'result'          :   ['./src/pages/result/index.js'],
    'detail'          :   ['./src/pages/detail/index.js'],
    'cart'          :   ['./src/pages/cart/index.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath :'/dist/',
    filename: 'js/[name].js'
  },
  resolve:{
    alias:{
      pages:path.resolve(__dirname, './src/pages'),
      service:path.resolve(__dirname, './src/service'),
      util:path.resolve(__dirname, './src/util'),
    }
  },
  module: {
    rules: [
      {//配置css
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
    			fallback: "style-loader",
    			use: "css-loader"
        })
      },
      {//配置图片
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
  				fallback: "style-loader",
  				use: ["css-loader","sass-loader"]
        })
      },
      { //配置图片
        test: /\.(png|jpg|gif|jpeg)/,
        use: [{ 
          loader: 'url-loader',
          options:{ 
              limit: 8192, // 把小于50000 byte的文件打包成Base64的格式写入JS 
              name: 'images/[name].[ext]' // 当大于是使用file-loader将图片打包到images目录下 
            } 
          }] 
      },
      {//配置react
        test: /\.(js|jsx)$/,           //匹配所有的js和jsx
        exclude:/node_modules/,       //除了这个文件夹外
        use: {
            loader: "babel-loader",//babel的相关配置在
            options: {
              presets: ['env','react']
            }    
         }
      },
      {//配置html-loader
           test: /\.string$/,
           use: {
               loader: 'html-loader',
               options: {
                  attrs: [':data-src']
                }
           }
      },
    ]
  },
  plugins: [
        //处理页面模板
        new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
        new HtmlWebpackPlugin(getHtmlConfig('user-login', '登录')),
        new HtmlWebpackPlugin(getHtmlConfig('user-register', '注册')),
        new HtmlWebpackPlugin(getHtmlConfig('result', '结果')),
        new HtmlWebpackPlugin(getHtmlConfig('detail', '商品详情')),
        new HtmlWebpackPlugin(getHtmlConfig('cart', '购物车')),

	      //处理css文件
  		  new ExtractTextPlugin("css/[name].css"),
        //处理公共文件
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            // (the commons chunk name)
            filename: 'js/commons.js',
            // (the filename of the commons chunk)
        }),
        new webpack.ProvidePlugin({
          　　$: "jquery",
          　　jQuery: "jquery"
          })
    ],
    devServer: {
      port:8089,
      proxy:{
        '/api':{
        target:'http://localhost:8088',
        changeOrigin:true
        }
      }
    },
};
