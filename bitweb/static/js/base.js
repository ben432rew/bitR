$(document).ready(function(){
	$( '#logout-btn' ).click(function(){
        $.removeCookie('token');
    })
})