var addressLookup = [];

var inboxMessages = function(){
    $('.inbox-bucket').children().hide();
    $.scope.inbox.splice(0);
    $.scope.chan_inbox.splice(0);

    var setColor = function(read){
        if (read === 1){
            return("#cfd8dc");
        }
        else {
            return('#eee');
        }
    };

    var setBold = function(read){
        if (read === 1){
            return("normal");
        }
        else {
            return('bold');
        }
    };

    var chan_addresses_only = [];
    var chan_addresses = localDB.getAllChanSubscriptions().done(function(){ 
        for (var i = 0; i < chan_addresses.e.length; i++) {
          chan_addresses_only.push(chan_addresses.e[i]['address']);
        }
        util.apiCall({
            url: 'allmessages',
            data:{'chans':chan_addresses_only},
            callBack: function( data ){
                data.messages.forEach(function(value) {
                    value.data.forEach(function(value){
                        value.receivedUnixTime= value.receivedTime
                        value.receivedTime = util.convertUnixTime(value.receivedTime);
                        value.fromaddress = value.fromAddress;
                        value.toaddress = value.toAddress;
                        value.inboxmessage = util.stringShorter( value.message, 12 );
                        value.inboxsubject = util.stringShorter( value.subject, 12 );
                        value.color = setColor(value.read);
                        value.font_weight = setBold(value.read)
                        if ( chan_addresses_only.indexOf(value.toAddress) != -1){
                            var index = $.scope.chans.indexOf("address", value.toAddress);
                            if(value.toAddress == value.fromAddress){
                                value.fromAddress = "Anonymous";
                            }
                            value.chan = ($.scope.chans[index]).chan_label;
                            $.scope.chan_inbox.push(value);
                        } else {
                        $.scope.inbox.push(value);
                        }
                    });
                });

                $.scope.chan_inbox.reverse()
                sessionStorage.setItem('inboxMessages', JSON.stringify($.scope.inbox));
                sessionStorage.setItem('chanMessages', JSON.stringify($.scope.chan_inbox));
            }
        })
    });
    $('#inbox-list').show();
    $('#table-head').show();
};

( function( $ ){
    "use strict";


    var sendersUpdate = function(){
        var options = $("#compose_msg_form > div > select");
        options.html('');
        $.each( $.scope.identities , function() {
            options.append($("<option />").val(this.key).text(this.identity));
        });
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
        
        $.material.ripples();
        $('.dropdown-toggle').dropdown();

        $( 'input.autoAddress' ).each(function(){

            $(this).autocomplete({
                source: function( req, response ) {
                    var wordlist = function(){
                        var list = [];
                        addressLookup.forEach(function( value ){
                            list.push( value.alias );
                        });

                        return list;
                    }();

                    var re = $.ui.autocomplete.escapeRegex( req.term );
                    var matcher = new RegExp( re, "i" );
                    var results = $.grep( wordlist, function( item,index ){
                        return matcher.test( item );
                    });

                    var display = []
                    results.map(function( item ){
                        var index = $.scope.inbox.indexOf.call( addressLookup, "alias", item );
                        display.push({
                            label: addressLookup[index].alias,
                            value: addressLookup[index].address
                        });
                    });

                    response( display );
                }
            });
        });


        adrs.addressesBook();
        inboxMessages();
        $('#chan_tab').hide()

        // populate list of identities
        util.apiCall({
            url: 'identities',
            callBack:function(data){
                if (data.addresses.length === 0 ){
                    $( '#create_identity' ).modal();
                } else {
                    data.addresses.forEach(function(value){
                        $.scope.identities.push(value);
                        sendersUpdate()
                    });
                }
            }
        });

        //show inbox message
        $('#inbox-list').on('click', '.new-message', function(e){
            var messages = JSON.parse(sessionStorage.getItem('inboxMessages'));
            var messid = $(this).find('#msg-id').text();
            // what does this do?
            for(var j in messages){
                if(messages[j].msgid == messid){
                    var the_message = messages[j];
                }
            }
            var from = the_message['fromAddress']
            var body = the_message['message']
            var subject = the_message['subject']
            var date = the_message['receivedTime']
            $("#mess_view_modal").modal("toggle")
            $("#mess-id").val($(this).find('#msg-id').text())
            $("#mess-subject").text(subject)
            $("#replyModalLabel").text(subject)
            $("#mess-body").text(body)
            localDB.getAliasFromAddressBook( from ).done(function(lookUp){
                $("#mess-from").html( lookUp )
            })
            localDB.getAliasFromAddressBook( the_message['toAddress'] ).done(function(lookUp){
                $("#mess-to").html( lookUp  )
            })
            $("#mess-date").html(date)
            $('#create_reply_button').show()
            $('#mess-reply').show()
            $('#delete_msg').attr('data-url','deleteInboxmessage')
            $('#messageModalLabel').html("Reply")

            if( the_message.read === 1 ) return ;
            util.apiCall({
                url: 'getInboxMessageByID',
                data: {
                    msgid: messid,
                    read: true
                },
                callBack: function(){
                    inboxMessages();
                }
            });
        });

        // add new identity to list, select it
        $( '#create_id_button' ).click(function() {
            util.apiCall({
                url: 'create_id',
                data: {
                    identity: $( '#identity_name' ).val()
                },

                callBack:function (data){
                    // error check might not be needed...
                    if ( 'error' in data ){
                    } else {
                        $.scope.identities.push( { identity: $( '#identity_name' ).val() } );
                        $.scope.senders.push( { identity: $( '#identity_name' ).val() } );

                    }
                    $( '#create_id_form' ).trigger('reset');
                }
            });
        });

        // show sent messages
        $('.inbox-nav').on( 'click', 'button#sent', function(){
            $('#chan_tab').hide()
            $( '#secondary' ).removeClass( 'btn-material-blue-grey-100' );
            $('#identityDrop').show()
            $( '#primary' ).addClass( 'btn-material-blue-grey-100' );
            $('.inbox-bucket').children().hide();
            $.scope.sent.splice(0);
            util.apiCall({
                url: 'allsentmessages',
                callBack:function( data ){
                    data.messages.forEach( function(value){
                        value.data.forEach( function( value ){
                            value['receivedTime'] = util.convertUnixTime(value['lastactiontime'])
                            value['fromaddress'] = value['fromAddress']
                            value['toaddress'] = value['toAddress']
                            value['inboxmessage'] = util.stringShorter(value['message'])
                            value['inboxsubject'] = util.stringShorter(value['subject'])
                            $.scope.sent.push( value );
                        });
                    });
                }
            }).done(function(){
                sessionStorage.setItem('sentMessages', JSON.stringify($.scope.sent));
                $('#sent-mess').show();
                $( '#table-head' ).show();
            });
        });

        // select identities to show 
        $('#id_ul').on( 'click', 'li.jq-repeat-identities > label', function(){
            var selected_identities = $('#identityDrop').text();
            var val = '.' + $( this ).parent().attr('data-iden-key');
            $( val ).toggle();
        });

        $('#primary').on( 'click', function(){
            $('#chan_tab').hide()
            $( '#secondary' ).removeClass( 'btn-material-blue-grey-100' );
            $('#identityDrop').show()
            $( this ).addClass( 'btn-material-blue-grey-100' );
            inboxMessages();
        } );

        $('.inbox-nav').on( 'click', 'button#inbox', function(){
            $('#chan_tab').hide()
            $( '#secondary' ).removeClass( 'btn-material-blue-grey-100' );
            $('#identityDrop').show()
            $( '#primary' ).addClass( 'btn-material-blue-grey-100' );
            inboxMessages();
        } );

        $('#profile-btn').on('click', function(e){
            e.preventDefault();
            $.scope.profileIdentities.splice(0);
            util.apiCall({
                url: 'identities',
                callBack: function( data ){
                    data.addresses.forEach(function(value){
                        $.scope.profileIdentities.push( value );            
                    })

                }
            });
        })

        $("#logout-btn").on("click", function(){
            util.apiCall({
                url: 'logout',
                callBack: function( data ){
                    window.location.replace('/')
                }
            });
            
        })

        $('#sent-mess').on('click', '.new-message', function(e){
            var messages = JSON.parse(sessionStorage.getItem('sentMessages'));
            var messid = $(this).find('#msg-id').text()

            for(var j in messages){
                if(messages[j]['msgid']==messid){
                    var the_message = messages[j];
                }
            }
            var toaddress = the_message['toAddress']
            var body = the_message['message']
            var subject = the_message['subject']
            var date = the_message['receivedTime']
            $("#mess_view_modal").modal("toggle")
            $("#mess-id").val($(this).find('#msg-id').text())
            $("#mess-subject").text(subject)
            $("#mess-body").text(body)
            $("#mess-date").html(date)
            $('#create_reply_button').hide()
            $('#mess-reply').hide()
            $('#messageModalLabel').html("Sent Message")
            $('#delete_msg').attr('data-url','deleteSentmessage')
            localDB.getAliasFromAddressBook( toaddress ).done(function(lookUp){
                $("#mess-from").html( lookUp )
            })

            if( the_message['read'] === 1 ) return ;
            util.apiCall({
                url: 'getInboxMessageByID',
                data: {
                    msgid: messid,
                    read: true
                },
                callBack: function(){
                    inboxMessages();
                }
            });
        });
    } );
})(jQuery);
