( function( $ ){
    'use strict';

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
        $.scope.chan_inbox.splice(0);

        var chan_addresses;
        APIcal({
            url: 'allmessages',
            callBack: function( data ){
                chan_addresses = data['chans']
                data['messages'].forEach(function(value) {
                    value['data'].forEach(function(value){
                        if ( (value['fromAddress']).length>=15){
                            value['fromAddress'] = (value['fromAddress'].slice(0,15) +"...")
                        }
                        if ( (value['toAddress']).length>=15){
                            value['toAddress'] = (value['fromAddress'].slice(0,15) +"...")
                        }
                        if ( (value['message']).length>=15){
                            value['message'] = (value['message'].slice(0,15) +"...")
                        }
                        if (value['read'] == 1){
                            value['color'] = "blue"
                        }
                        else {
                            value['color'] = 'white'
                        }
                        if ( chan_addresses.indexOf(value['toAddress']) != -1){ 
                            $.scope.chan_inbox.push(value);
                        } else {
                            $.scope.inbox.push(value);
                        }
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
            callBack:function(data){
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

        $('#inbox-list').on('click', '.new-message', function(e){
            e.preventDefault();
            var messages = JSON.parse(sessionStorage.getItem('inboxMessages'));
            var messid = $(this).find('#msg-id').text()
            var the_message
            for(var j in messages){
                if(messages[j]['msgid']==messid){
                    the_message = messages[j];
                }
            }
            var from = the_message['fromAddress']
            var body = the_message['message']
            var subject = the_message['subject']
            var date = the_message['receivedTime']
            $("#mess_view_modal").modal("toggle")
            $("#mess-id").val($(this).find('#msg-id').text())
            $("#mess-subject").html(subject)
            $("#mess-body").html(body)
            $("#mess-date").html(date)
            $("#mess-from").html(from)
        })

        $("#chan-form").submit(function(e){
            e.preventDefault();
            var form_data = $("#chan_name").val();
            var info = {}
            info['token'] = $.cookie( 'token' )
            info['form'] = form_data
            $.post('/bmapi/create_chan', JSON.stringify(info), function(data){
                $.scope.chans.push(data)
                $('#create_chan').modal('toggle');
            })
        })


        APIcal({
            url: 'allchans',
            callBack: function (data){
                if (typeof data['chans'] == "string") {
                    window.location.replace('bmapi/logout');
                } else {
                    data['chans'].forEach(function(value) {
                        $.scope.chans.push(value)
                        $.scope.post_chan_list.push(value)
                    })
                }
            }
        });

    // add new identity to list, select it
        $( '#create_id_button' ).click(function() {
            APIcal({
                url: 'create_id',
                data: {
                    identity: $( '#identity_name' ).val()
                },
                callBack:function (data){
                    // error check might not be needed...
                    if ( 'error' in data ){
                    } else {
                        $.scope.identities.push( { identity: $( '#identity_name' ).val() } );
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

        $( '#post_message_btn' ).click(function() {
            var info = {}
            info['to_address'] = 'chan_post';
            info['from'] = $( '#chan_post_list' ).val();
            info['subject'] = $( '#post_subject' ).val();
            info['message'] = $( '#post_message' ).val();
            APIcal({
                url: 'send',
                data: info,
                callBack: function(){}
            });
        })

        $( '#delete_msg' ).click(function() {
            var info = {}
            info['msgid'] =  $( '#mess-id' ).val();
            inboxMessages()
            APIcal({
                url: 'deletemessage',
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

        $('#chan_tab').on( 'click', function(){
            $( this ).toggleClass( 'btn-material-blue-grey-100' )
            $( '#primary-tab' ).toggleClass( 'btn-material-blue-grey-100' )
            $('.inbox-bucket').children().hide()
            $('#chan_mess').show()
        })
        
            $('')


        $('#primary-tab').on( 'click', function(){
            $( this ).toggleClass( 'btn-material-blue-grey-100' )
            $( '#chan_tab' ).toggleClass( 'btn-material-blue-grey-100' )
            inboxMessages()
        } );

        $('.inbox-nav').on( 'click', 'button#inbox', function(){
            inboxMessages()
        } );
    
    } );


})(jQuery);
