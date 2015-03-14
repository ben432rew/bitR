(function( $ ){
'use strict';

    var authorize = function(event, string, form) {
        event.preventDefault();
        var loginInfo = $( form ).serializeObject();
        $.post('/bmapi/' + string, JSON.stringify(loginInfo), function (data){
            if (data['token']) {
                $.cookie( 'token', data['token'], { expires: 1 } );
                window.location.replace('/inbox');
            }
            else {
                alert('Sorry, that ' + string + ' information is not valid');
                form.reset();
            }
        })
    };
        
    // code from website : http://validate.718it.biz/js/validate.js
    var passwordStrength = function( value ){
        //simple password check must have 1 number 1 up case
        var reg = /^(?=[^\d_].*?\d)\w(\w|[!@#$%]){1,256}/;
        if ( !reg.test( value ) ) {
            return [false,'Password is not strong enough'];
        }
        return [true,""];
    }
    var passwordMatch = function(pass1,pass2){
        if (pass1 !== pass2){
            return [false,"Password does not match"];
        }
        return [true,""];
    } 

    $(document).ready(function(){
        $.material.ripples();

        /*$( 'header' ).scrollspy({
            onEnter: function(){
                console.log( 'header enter', this, arguments);
            },
            onLeave: function(){
                console.log( 'header leave', this, arguments);
            }
        });*/

        $( $( 'selection.well' )[6] ).scrollspy({
            onEnter: function( element ){
                $('main').fadeTo( 'slow', .6 );
            }
        });

        $( $( 'selection.well' )[7] ).scrollspy({
            onEnter: function( element ){
                $('main').fadeTo( 'slow', 1 );
                //$('#forms').hide();
            }
        });
        
        $('#signup').on('click', function(e) {
            $( ".login" ).hide();
            $( ".signup" ).show();
        });

        $('#login').on('click', function(e) {
            $( ".signup" ).hide();
            $( ".login" ).show();
        });

        $( '#lg_logo' ).show( 1500, function(){
            $( '#forms' ).slideDown( 1000, function(){
                $( 'main' ).show( 'slide', { direction: 'left' }, 1000 )
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
