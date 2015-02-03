$(document).ready(function(){
	$.material.ripples();
	$( '#logout-btn' ).click(function(){
        $.removeCookie('token');
    })
})