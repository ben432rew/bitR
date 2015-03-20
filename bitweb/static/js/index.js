(function( $ ){
'use strict';

    var authorize = function( event, action, form ) {
        event.preventDefault();
        var loginInfo = $( form ).serializeObject();
        $.post( '/bmapi/' + action, JSON.stringify(loginInfo), function (data){
            if (data['token']) {
                $.cookie( 'token', data['token'], { expires: 1 } );
                window.location.replace('/inbox');
            }
            else {
                alert('Sorry, that ' + action + ' information is not valid');
                form.reset();
            }
        })
    };
        
    // code from website : http://validate.718it.biz/js/validate.js
    var passwordStrength = function( value ){
        //simple password check must have 1 number 1 up case
        var reg = /^(?=[^\d_].*?\d)\w(\w|[!@#$%]){1,256}/;
        if ( !reg.test( value ) ) {
            return [ false,'Password is not strong enough' ];
        }
        return [ true,"" ];
    }
    var passwordMatch = function( pass1,pass2 ){
        if ( pass1 !== pass2 ){
            return [ false, "Password does not match" ];
        }
        return [ true,"" ];
    } 

    $(document).ready(function(){
        $.material.ripples();

        $( window ).on( 'scroll', function(){
            var scrollPercent = window.scrollY / ( window.innerHeight / 1.25 );

            var $main = $( 'main' );
            var $header = $( 'header' );

            if( scrollPercent < 1 ){
                if( scrollPercent < .3){
                    $main.fadeTo( 1, .3 );
                } else{
                    $main.fadeTo( 1, scrollPercent );
                }
                $header.fadeTo( 1, 1-scrollPercent );
            }else{
                $header.fadeTo( 1, 0 );
                $main.fadeTo( 1, 1 );
            }

        } );

        $('#signup').on('click', function(e) {
            $( ".login" ).hide();
            $( ".signup" ).show();
        });

        $('#login').on('click', function(e) {
            $( ".signup" ).hide();
            $( ".login" ).show();
        });

        $( '#lg_logo' ).show( 1000 , function(){
            $( '#forms' ).slideDown( 500, function(){
                $( 'main' ).show( 'slide', { direction: 'left' }, 1000 );
            } );
        });

        $('#signup_form').on( 'submit', function(event) {
            event.preventDefault();
            var pass1 = $('#id_password1').val();
            var pass2 = $('#id_password2').val();
            var match = passwordMatch(pass1,pass2);
            var strength = passwordStrength(pass1);
            if( match[0]==true && strength[0]==true ){
                authorize( event, 'signup', this );
            }else{
                alert(match[1] +" \n" +strength[1] );
            }
        });

        $('#login_form').on( 'submit', function( event ){
            authorize( event, 'login', this );
        });

    });

})( jQuery );
