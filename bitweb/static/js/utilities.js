var util = {

    apiCall: function( args ){
        var data = args.data || {};
        data = $.extend( {}, { 'token': $.cookie( 'token' ) }, data );
        var callBack = args.callBack || function(){};

        return $.ajax({
            url: '/bmapi/' + args.url,
            type: 'POST',
            data: JSON.stringify( data ),
            success: callBack,
            statusCode: {
                401: function(){
                    var token = JSON.stringify({token:$.cookie("token") })
                    $.post('/bmapi/logout', token ).done(function(){
                        window.location.replace('/');   
                    });
                },
                500: function(){
                    alert( "Sever Error" );
                }
            }
        });
    },

    stringShorter: function( string, len ){
        len = ( len || 15 ) - 3;

        if ( string != undefined && (string).length >= len ){
            string = (string.slice(0,15) +"...");
        }

        return string;
    },

    convertUnixTime: function(data){
        var date = new Date(data*1000);
        return String(date).slice(16,21)+"  "+String(date).slice(0,15) ;
    }
  
}
