( function( $ ){
     "use strict";

    var APIcal = function( args ){
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
                    window.location.replace('/bmapi/logout?message=Expired');
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
    
        var convertUnixTime = function(data){
            var date = new Date(data*1000);
            return(String(date).slice(16,21)+"  "+String(date).slice(0,15))
        };
        var StringShorter=function(string){
            if ( (string).length>=15){
                return (string.slice(0,15) +"...");
            }
            else{
                return string;
            }
        };
        var MessageShorter=function(string){
            if ( (string).length>=12){
                return (string.slice(0,11) +"...");
            }
            else{
                return string;
            }
        };
        var SetColor = function(read){
             if (read === 1){
                return("#cfd8dc");
            }
            else {
                return('#eee');
            }
        };


        var chan_addresses;
        APIcal({
            url: 'allmessages',
            callBack: function( data ){
                chan_addresses = data['chans']
                data['messages'].forEach(function(value) {
                    value['data'].forEach(function(value){
                        value['receivedTime'] = convertUnixTime(value['receivedTime'])
                        value['fromaddress'] = StringShorter(value['fromAddress'])
                        value['toaddress'] = StringShorter(value['toAddress'])
                        value['inboxmessage'] = MessageShorter(value['message'])
                        value['inboxsubject'] = MessageShorter(value['subject'])
                        value['color'] = SetColor(value['read'])
                        if ( chan_addresses.indexOf(value['toAddress']) != -1){
                            var index = $.scope.chans.indexOf("chan_address", value['toAddress'])
                            if(value['toAddress'] == value['fromAddress']){
                                value['fromAddress'] = "Anonymous"
                            }
                            value['chan'] = ($.scope.chans[index])['chan_label'];
                            $.scope.chan_inbox.push(value);
                        } else {
                            $.scope.inbox.push(value);
                        }
                    });
                });
                sessionStorage.setItem('inboxMessages', JSON.stringify($.scope.inbox));
                sessionStorage.setItem('chanMessages', JSON.stringify($.scope.chan_inbox));
                if ( $('#identityDrop').text() == 'Mail: No Identitites Selected ') {
                    $('#inbox-list > li').hide()
                }
            }
        });


        $('#inbox-mess').show();
    };

    var addressesBook = function(){
        APIcal({
            url: 'GetAddressBook',
            callBack: function( data ){
                $.scope.addressBook.push.apply( $.scope.addressBook, data['book'] )
            }
        });
    };

    $(document).ready(function(){

        addressesBook();

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

            for(var j in messages){
                if(messages[j]['msgid']==messid){
                    var the_message = messages[j];
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

            if( the_message['read'] === 1 ) return ;
            APIcal({
                url: 'getInboxMessageByID',
                data: {
                    msgid: messid,
                    read: true
                },
                callBack: function(){
                    inboxMessages();
                }
            });
        })

        $("#chan-form").submit(function(e){
            e.preventDefault();
            var info = {}
            info['form'] = $("#chan_name").val();
            $( '#chan-form' ).trigger('reset')
            APIcal({
                url: 'create_chan',
                data: info,
                callBack: function(data){
                    $.scope.chans.push(data)
                    $.scope.post_chan_list.push(data)
                    $('#create_chan').modal('toggle');

                }
            });            
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
                    sessionStorage.setItem('chanNameList', JSON.stringify($.scope.chans));
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
                    $( '#create_id_form' ).trigger('reset')
                }
            })
        })

        $( '#send_message_btn' ).click(function() {
            var info = {}
            info['to_address'] = $( '#send_addy' ).val();
            info['from'] = $( '#from_addy' ).val();
            info['subject'] = $( '#subject' ).val();
            info['message'] = $( '#message' ).val();
            $( '#compose_msg_form' ).trigger('reset')
            APIcal({
                url: 'send',
                data: info,
            });
        })

        $( '#post_message_btn' ).click(function() {
            var info = {}
            info['to_address'] = 'chan_post';
            info['from'] = $( '#chan_post_list' ).val();
            info['subject'] = $( '#post_subject' ).val();
            info['message'] = $( '#post_message' ).val();
            $( '#post_chan_form' ).trigger('reset')
            APIcal({
                url: 'send',
                data: info,
            });
        })

        $( '#delete_msg' ).click(function() {
            var info = {
                msgid: $( '#mess-id' ).val()
            }
            APIcal({
                url: 'deleteInboxmessage',
                data: info,
                callBack: function(){
                    inboxMessages()
                }
            });
        });

        $( '#sub_chan_btn' ).click(function() {
            var info = {}
            info['label'] = $( '#chan_label' ).val();
            info['address'] = $( '#chan_addy' ).val();
            APIcal({
                url: 'joinchan',
                data: info,
                callBack: function (data){
                    if ( 'error' in data ){
                    } else {
                        $.scope.chans.push(data);
                        $.scope.post_chan_list.push(data)
                    }
                }
            })
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
                        sessionStorage.setItem('sentMessages', JSON.stringify($.scope.sent));
                    } );
                }
            })
            $('#sent-mess').show()
        } );

        $('#chan_tab').on( 'click', function(){
            $( this ).addClass( 'btn-material-blue-grey-100' )
            $( '#identityDrop' ).removeClass( 'btn-material-blue-grey-100' )
            $('.inbox-bucket').children().hide()
            $('#chan_mess').show()
            if ( $('#chan_tab').text() == 'No Chans Selected ') {
                // $('#chan_ul_inbox_well > div').hide()
            }
          
        })

        $('#chan_ul').on( 'click', 'li.jq-repeat-chans > label', function(){
            var selected_chans = $('#chan_tab').text()
            var val = '.' + $( this ).parent().attr('data-chan-add')
            $( val ).toggle()
        })

        $('#id_ul').on( 'click', 'li.jq-repeat-identities > label', function(){
            var selected_identities = $('#identityDrop').text()
            var val = '.' + $( this ).parent().attr('data-iden-key')
            $( val ).toggle()
        })

        $('#identityDrop').on( 'click', function(){
            $( this ).addClass( 'btn-material-blue-grey-100' )
            $( '#chan_tab' ).removeClass( 'btn-material-blue-grey-100' )
            inboxMessages()
        } );

        $('.inbox-nav').on( 'click', 'button#inbox', function(){
            inboxMessages()
        } );

        $('[name="addAddressEntry"]').on( 'submit', function( event ){
            event.preventDefault();
            var formData = $(this).serializeObject();
            APIcal({
                url: 'addAddressEntry',
                data: formData,
                callBack: function( data ){
                    $.scope.addressBook.push( formData );
                }
            });
        });
    
    } );


})(jQuery);
