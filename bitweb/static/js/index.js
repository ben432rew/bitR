$(document).ready(function(){
    $.material.ripples()
    $( ".signup" ).hide();
    
    $('#signup').on('click', function(e) {
        $( ".login" ).hide('medium');
        $( ".signup" ).show('medium');
    })

    $('#login').on('click', function(e) {
        $( ".signup" ).hide('medium');
        $( ".login" ).show('medium');
    })

    $('#signup_form').on('click', function(e) {
        $.post('/bmapi/signup', JSON.stringify(user_id), function (data){
            
        })
    })

    $('#login_form').on('click', function(e) {
        $.post('/bmapi/login', JSON.stringify(user_id), function (data){

        })
    })

    $("input").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $("form").submit();
        }
	});
    
});
