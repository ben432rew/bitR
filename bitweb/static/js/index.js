var authorize = function(event, string, form) {
        event.preventDefault()        
        var loginInfo = $( form ).serializeObject();
        $.post('/bmapi/' + string, JSON.stringify(loginInfo), function (data){
            if (data['token']) {
                $.cookie( 'token', data['token'], { expires: 1 } );
                window.location.replace('/inbox');
            } else {
                alert('Sorry, that ' + string + ' information is not valid')
                form.reset()
            }
        })
    };

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

    $("input.signup").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $("signup_form").submit();
        }
	});

    $("input.login").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $("login_form").submit();
        }
    });

    $('#signup_form').submit(function(event) {
        authorize(event, 'signup', this)
    })

    $('#login_form').submit(function(event){
        authorize(event, 'login', this)
    })
    
});

