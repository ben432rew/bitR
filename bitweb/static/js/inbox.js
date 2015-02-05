( function( $ ){

    var APIcal = function( args ){
        var data = args.data || {}
        data = $.extend( {}, { 'token': $.cookie( 'token' ) }, data )

        $.ajax({
            url: '/bmapi/' + args.url,
            type: 'POST',
            data: JSON.stringify( data ),
            success: args.callBack,
            statusCode: {
                401: function(){
                    alert( "Token expired" );
                    $.removeCookie('token');
                    window.location.replace('/')
                },
                500: function(){
                    alert( "Sever Error" );
                }
            }
        });
    };

    var inboxMessages = function(){
        $('.inbox-bucket').children().hide();
        $.scope.inbox.splice(0);

        APIcal({
            url: 'allmessages',
            callBack: function( data ){
                data['messages'].forEach(function(value) {
                    value['data'].forEach(function(value){
                        if (value['read'] == 1){
                            value['color'] = "blue"
                        }
                        else {
                            value['color'] = 'white'
                        }
                        $.scope.inbox.push(value);
                    });
                });
                sessionStorage.setItem('inboxMessages', JSON.stringify($.scope.inbox));
            }
        });

        $('#inbox-mess').show();
    };

    $(document).ready(function(){

        $.scope.inbox.__put = function(){
            this.slideDown();
        };

        $.scope.inbox.__take = function(){
            this.slideUp('slow', function(){
                this.remove();
            });
        };

        $.scope.sent.__put = function(){
            this.slideDown();
        };
        
        $.scope.sent.__take = function(){
            this.slideUp('slow', function(){
                this.remove();
            });
        };

        $('.dropdown-toggle').dropdown();

        inboxMessages();

        APIcal({
            url: 'identities',
            callBack:function (data){
                if (data['addresses'].length === 0 ){
                    $( '#create_identity' ).modal();
                } else if (typeof data['addresses'] == "string") {
                    window.location.replace('bmapi/logout');
                } else {
                    data['addresses'].forEach(function(value) {
                        $.scope.identities.push(value)
                        $.scope.senders.push(value)
                    })
                }
            }
        });

        APIcal({
            url: 'allchans',
            callBack: function (data){
                if (typeof data['chans'] == "string") {
                    window.location.replace('bmapi/logout');
                } else {
                    data['chans'].forEach(function(value) {
                        $.scope.chans.push(value)
                    })
                }
            }
        });

    // add new identity to list, select it
        $( '#create_id_button' ).click(function() {
            var info = tokenValue;
            APIcal({
                url: 'create_id',
                data: {
                    identity: $( '#identity_name' ).val()
                },
                callBack:function (data){
                    // error check might not be needed...
                    if ( 'error' in info ){
                    } else {
                        $.scope.identities.push(info);
                    }
                }
            })
        })

        $( '#send_message_btn' ).click(function() {
            var info = {}
            info['to_address'] = $( '#send_addy' ).val();
            info['from'] = $( '#from_addy' ).val();
            info['subject'] = $( '#subject' ).val();
            info['message'] = $( '#message' ).val();
            APIcal({
                url: 'send',
                data: info,
                callBack: function(){}
            });
        })

        $( '#sub_chan_btn' ).click(function() {
            var info = {}
            info['label'] = $( '#chan_label' ).val();
            info['address'] = $( '#chan_addy' ).val();
            APIcal({
                url: 'joinchan',
                callBack: function (data){
                    if ( 'error' in data ){
                    } else {
                        $.scope.chans.push(data);
                    }
                }
            })
        })

        $( '#create_chan_button' ).click(function() {
    // send json to createchan function
    // set new chan as active chan in chan tab
        })

        $('.inbox-nav').on( 'click', 'button#sent', function(){
            $('.inbox-bucket').children().hide()
            $.scope.sent.splice(0);
            APIcal({
                url: 'allsentmessages',
                callBack:function( data ){
                    data['messages'].forEach(function(value) {
                        value['data'].forEach(function(value){
                            $.scope.sent.push(value);
                        } );
                    } );
                }
            })
            $('#sent-mess').show()
        } );

        $('.inbox-nav').on( 'click', 'button#inbox', function(){
            inboxMessages()
        } );
    } );

})(jQuery);
