/*
* @Author: 羊驼
* @Date:   2018-12-23 11:03:44
* @Last Modified by:   羊驼
* @Last Modified time: 2018-12-26 18:05:33
*/
$(function(){
	$(document).on('mouseenter', '.user-box , .logoutBox', function(event) {
		$('.logoutBox').show();
	});
	$(document).on('mouseleave', '.user-box , .logoutBox', function(event) {
		$('.logoutBox').hide();
	});
	$(document).on('click', '.logoutBox a', function(event) {
		// event.preventDefault();
		$.ajax({ 
            type: "post", //提交方式 
            url : "/api/user/logout",//路径
            success : function(res) {//返回数据根据结果进行相应的处理
                window.location.reload();
            },
            error:function(){
                alert('退出失败')
            }
        }); 
	});
})