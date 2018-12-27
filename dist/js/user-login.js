webpackJsonp([1],{

/***/ 18:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(19);


/***/ }),

/***/ 19:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(20);

__webpack_require__(21);

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _mm2 = __webpack_require__(1);

var _mm3 = _interopRequireDefault(_mm2);

var _userService = __webpack_require__(2);

var _userService2 = _interopRequireDefault(_userService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//错误提示
var fromError = {
	show: function show(err) {
		(0, _jquery2.default)('.error-item').show().find('.err-msg').text(err);
	},
	hide: function hide(err) {
		(0, _jquery2.default)('.error-item').hide().find('.err-msg').text(err);
	}
	//页面page
}; /*
   * @Author: 羊驼
   * @Date:   2018-12-26 13:41:02
   * @Last Modified by:   羊驼
   * @Last Modified time: 2018-12-26 17:31:14
   */
var page = {
	init: function init() {
		this.bindEvent();
	},
	bindEvent: function bindEvent() {
		var _this = this;
		(0, _jquery2.default)('#submit').click(function () {
			_this.submit();
		});
		(0, _jquery2.default)('.user-content').keyup(function (event) {
			if (event.keyCode === 13) {
				_this.submit();
			}
		});
	},
	submit: function submit() {
		var fromData = {
			username: _jquery2.default.trim((0, _jquery2.default)('#username').val()),
			password: _jquery2.default.trim((0, _jquery2.default)('#password').val())
		};
		//表单验证结果
		var validateResult = this.fromValiDate(fromData);
		//验证成功
		if (validateResult.status) {
			_userService2.default.login(fromData, function (res) {
				window.location.href = _mm3.default.getUrlParam('redirect') || './index.html';
				// console.log($.parseJSON($.cookie("userInfo")).username);
			}, function (err) {
				fromError.show(err);
			});
		} else {
			//验证失败
			fromError.show(validateResult.msg); // 错误提示
		}
	},
	// 表单验证
	fromValiDate: function fromValiDate(fromData) {
		var result = {
			status: false,
			msg: ''
		};
		if (!_mm3.default.validata(fromData.username, 'require')) {
			result.msg = '用户名不能为空';
			return result;
		}
		if (!_mm3.default.validata(fromData.password, 'require')) {
			result.msg = '密码不能为空';
			return result;
		}
		//验证成功
		result.status = true;
		result.msg = '验证通过';
		return result;
	}
};

page.init();

/***/ }),

/***/ 20:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(22);

/***/ }),

/***/ 22:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[18]);