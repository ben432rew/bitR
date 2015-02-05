( function( $ ){

    var tokenValue = {'token': $.cookie('token') }

    var inboxMessages = function(){
        $('.inbox-bucket').children().hide();
        $.scope.inbox.splice(0);
        var chan_addresses;
        $.post('/bmapi/allmessages', JSON.stringify(tokenValue), function (data){
            chan_addresses = data['chans']
            data['messages'].forEach(function(value) {
                value['data'].forEach(function(value){
                    if (value['read'] == 1){
                        value['color'] = "blue"
                    }
                    else {
                        value['color'] = 'white'
                    }
                    if ( value['toAddress'] in chan_addresses){ 
                        $.scope.chan_inbox.push(value);
                    } else {
                        $.scope.inbox.push(value);
                    }
                });
            });
            sessionStorage.setItem('inboxMessages', JSON.stringify($.scope.inbox));
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

        $.post('/bmapi/identities', JSON.stringify(tokenValue), function (data){
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
        })

        $.post('/bmapi/allchans', JSON.stringify(tokenValue), function (data){
            if (typeof data['chans'] == "string") {
                window.location.replace('bmapi/logout');
            } else {
                data['chans'].forEach(function(value) {
                    $.scope.chans.push(value)
                })
            }
        })

    // add new identity to list, select it
        $( '#create_id_button' ).click(function() {
            var info = tokenValue;
            info['identity'] = $( '#identity_name' ).val();
            $.post('/bmapi/create_id', JSON.stringify(info), function (data){
                if ( 'error' in data ){
                } else {
                    $.scope.identities.push(data);
                }
            })
        })

        $( '#send_message_btn' ).click(function() {
            var info = tokenValue;
            info['to_address'] = $( '#send_addy' ).val();
            info['from'] = $( '#from_addy' ).val();
            info['subject'] = $( '#subject' ).val();
            info['message'] = $( '#message' ).val();
            $.post('/bmapi/send', JSON.stringify(info), function (data){
    // add message to sent messages folder (UNFINISHED)
                })
        })

        $( '#sub_chan_btn' ).click(function() {
            var info = tokenValue;
            info['label'] = $( '#chan_label' ).val();
            info['address'] = $( '#chan_addy' ).val();
            $.post('/bmapi/joinchan', JSON.stringify(info), function (data){
                if ( 'error' in data ){
                } else {
                    $.scope.chans.push(data);
                }
            })
        })

        $( '#create_chan_button' ).click(function() {
    // send json to createchan function
    // set new chan as active chan in chan tab
        })

        $( '#refresh-btn' ).click(function(event) {
            event.preventDefault();
            $.get('/bmapi/allmessages', function (data){
                $.scope.splice(0);
                data['messages'].forEach(function(value) {
                $.scope.inbox.push(value)
                })
            })
        })

        $('#chanss').on( 'click', function(){
            console.log("here again")
            $('.inbox-bucket').children().hide()
            $('#chan_mess').show()
        })

        $('.inbox-nav').on( 'click', 'button#sent', function(){
            $('.inbox-bucket').children().hide()
            $.scope.sent.splice(0);
            $.post( '/bmapi/allsentmessages', JSON.stringify( tokenValue ),function( data ){
                data['messages'].forEach(function(value) {
                    value['data'].forEach(function(value){
                        $.scope.sent.push(value);
                        } );
                    } );
                } );
                $('#sent-mess').show()
            } );

            $('')

            $('#primary-tab').on( 'click', function(){
                inboxMessages()
            } );

            $('.inbox-nav').on( 'click', 'button#inbox', function(){
                inboxMessages()
            } );
    
        } );


})(jQuery);
