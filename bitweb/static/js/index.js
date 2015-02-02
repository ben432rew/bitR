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

// dry these two out
    $('#signup_form').submit(function(event) {
        event.preventDefault()
        var signupInfo = $( this ).serializeObject();
        $.post('/bmapi/signup', JSON.stringify(signupInfo), function (data){ 
            if (data['token']) {
                $.cookie( 'token', data['token'], { expires: 1 } );
                window.location.replace('/inbox');
            } else {
                alert('Sorry, that signup information is not valid')
                signupInfo.reset()
            }
        })
    })

    $('#login_form').submit(function(event) {
        event.preventDefault()        
        var loginInfo = $( this ).serializeObject();
        $.post('/bmapi/login', JSON.stringify(loginInfo), function (data){
            if (data['token']) {
                $.cookie( 'token', data['token'], { expires: 1 } );
                window.location.replace('/inbox');
            } else {
                alert('Sorry, that login information is not valid')
                signupInfo.reset()
            }
        })
    })
    
});
