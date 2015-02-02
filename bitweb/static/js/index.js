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

    $("input").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $("form").submit();
        }
	});

    $('#signup_form').submit(function() {
        var signupJson = $( this ).serializeObject();
        $.post('/bmapi/signup', JSON.stringify(signupJson), function (data){ 
        })
    })

    $('#login_form').submit(function() {
        var loginJson = $( this ).serializeObject();
        $.post('/bmapi/login', JSON.stringify(loginJson), function (data){
        })
    })
    
});
