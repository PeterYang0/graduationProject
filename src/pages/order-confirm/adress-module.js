/*
* @Author: 羊驼
* @Date:   2018-05-18 09:08:56
* @Last Modified by:   羊驼
* @Last Modified time: 2018-05-19 20:16:33
*/
import _mm from 'util/mm.js';
import templateAdressModule from './adress-module.string';
import _adress from 'service/adress-service.js';
import _cities from 'util/cities/index.js';

var adressModule={
	show:function(option){
		this.option=option;
		this.option.data=option.data||{};
		console.log(this.option)
		this.loadModule();
		this.bindEvent();
	},
	hidden:function(){
		$(".module-wrap").empty();
	},
	loadModule:function(){
		var moduleHtml=_mm.renderHtml(templateAdressModule,{
			data:this.option.data,
			isUpdate:this.option.isUpdate
		});
		$('.module-wrap').html(moduleHtml);
		//加载省份
		this.loadProvince();
	},
	loadProvince:function(){
		var provinces=_cities.getProvinces();
		$('#receiver-province').html(this.getOption(provinces));
		//更新的话回填省份
		if (this.option.isUpdate&&this.option.data.receiverProvince) {
			$('#receiver-province').val(this.option.data.receiverProvince);
			this.loadCity(this.option.data.receiverProvince);
		}
	},
	loadCity:function(selectedProvinces){
		var cities=_cities.getCities(selectedProvinces);
		$('#receiver-city').html(this.getOption(cities));
		//更新的话回填城市
		if (this.option.isUpdate&&this.option.data.receiverCity) {
			$('#receiver-city').val(this.option.data.receiverCity)
		}
	},
	bindEvent:function(){
		var _this=this;
		$('#receiver-province').change(function(){
			var selectedProvinces=$(this).val();
			_this.loadCity(selectedProvinces);
		});
		$('.module-wrap').find('.adress-save').click(function(e){
			e.stopPropagation();
			var receiverInfo=_this.getReceiverInfo();
			var isUpdate=_this.option.isUpdate;
			//如果不是更新且表单验证成功
			if (!isUpdate&&receiverInfo.status) {
				_adress.save(receiverInfo.data,function(res){
					_mm.successTips('更新成功');
					_this.hidden();
					_this.option.onSuccess();
				},function(err){
					_mm.errorTips(err);
				})
			}//更新收件人且验证通过
			else if(isUpdate&&receiverInfo.status){
				if (_this.option.isUpdate) {
					receiverInfo.data.id=$(this).data('xid');
				}
				_adress.update(receiverInfo.data,function(res){
					_mm.successTips('更新成功');
					_this.hidden();
					_this.option.onSuccess();
				},function(err){
					_mm.errorTips(err);
				})
			}//验证不通过
			else{
				_mm.errorTips(receiverInfo.msg);
			}
		});
		//点击关闭
		$(document).on('click','.close',function(){
			_this.hidden();
		})
		//阻止冒泡
		$(document).on('click','.panel',function(e){
			e.stopPropagation();
		})
	},
	//获取变单信息，并验证
	getReceiverInfo:function(){
		var receiverInfo={

		};
		var result={
			status :false,
			msg    :''
		};
		receiverInfo.receiverName=$.trim($('#receiver-name').val());
		receiverInfo.receiverProvince=$.trim($('#receiver-province').val());
		receiverInfo.receiverCity=$.trim($('#receiver-city').val());
		receiverInfo.receiverAdress=$.trim($('#receiver-adress').val());
		receiverInfo.receiverPhone=$.trim($('#receiver-phone').val());
		receiverInfo.receiverZip=$.trim($('#receiver-zip').val());
		if (!receiverInfo.receiverName) {
			result.msg='请输入收件人姓名';
			return result;
		}
		if (!receiverInfo.receiverProvince) {
			result.msg='请选择城市省份';
			return result;
		}
		if (!receiverInfo.receiverCity) {
			result.msg='请选择城市';
			return result;
		}
		if (!receiverInfo.receiverAdress) {
			result.msg='请输入收件人详细地址';
			return result;
		}
		if (!receiverInfo.receiverPhone) {
			result.msg='请输入收件人联系方式';
			return result;
		}
		result.status=true;
		result.data=receiverInfo;
		return result;
	},
	//获取选项
    getOption:function(Array){
		var html="<option value=''>请选择</option>";
		for (var i = 0; i < Array.length ; i++) {
			html+="<option value="+Array[i]+">"+Array[i]+"</option>"
		}
		return html;
    }
}
export default adressModule;