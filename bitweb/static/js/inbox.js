( function( $ ){
	"use strict";

	var addressLookup = [];

	var apiCall = function( args ){
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
					window.location.replace('/bmapi/logout');
				},
				500: function(){
					alert( "Sever Error" );
				}
			}
		});
	};

	var stringShorter = function( string, len ){
		len = ( len || 15 ) - 3;

		if ( (string).length >= len ){
			string = (string.slice(0,15) +"...");
		}

		return string;
	};

	var convertUnixTime = function(data){
		var date = new Date(data*1000);
		return String(date).slice(16,21)+"  "+String(date).slice(0,15) ;
	};

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

		var chan_addresses;
		apiCall({
			url: 'allmessages',
			callBack: function( data ){
				chan_addresses = data.chans;
				data.messages.forEach(function(value) {
					value.data.forEach(function(value){
						value.receivedTime = convertUnixTime(value.receivedTime);
						value.fromaddress = value.fromAddress;
						value.toaddress = value.toAddress;
						value.inboxmessage = stringShorter( value.message, 12 );
						value.inboxsubject = stringShorter( value.subject, 12 );
						value.color = setColor(value.read);
						if ( chan_addresses.indexOf(value.toAddress) != -1){
							var index = $.scope.chans.indexOf("chan_address", value.toAddress);
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
				sessionStorage.setItem('inboxMessages', JSON.stringify($.scope.inbox));
				sessionStorage.setItem('chanMessages', JSON.stringify($.scope.chan_inbox));
				if ( $('#identityDrop').text() == 'Mail: No Identitites Selected ') {
					$('#inbox-list > li').hide();
				}
			}
		});

		$('#inbox-mess').show();
	};

	var processAddy = function( address, len ){
		var index = $.scope.addressBook.indexOf.call( addressLookup, 'address', address );
		if( index !== -1 ){
			address = addressLookup[index].name;
		}
		
		return address ;
	};

	var addressesBook = function(){
		apiCall({
			url: 'GetAddressBook',
			callBack: function( data ){
				$.scope.addressBook.push.apply( $.scope.addressBook, data.book );
				addressLookup.push.apply( addressLookup, data.book );
			}
		}).done(function(){
			var convertAddress = function( $element ){
				var address = processAddy( $element.html() );
				address = stringShorter( address );
				$element.html( address );
			};
			$(document).on('DOMNodeInserted', function(event) {
				if ( $( event.target ).is('.addyBook') ){
					convertAddress( $( this ) );
				}else{
					$( event.target ).find( '.addyBook' )
						.each(function( key, value ){
							convertAddress( $( value ) );
						});
				}
			});
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

		$('.dropdown-toggle').dropdown();

		addressesBook();
		inboxMessages();

		// populate list of identities
		apiCall({
			url: 'identities',
			callBack:function(data){
				if (data.addresses.length === 0 ){
					$( '#create_identity' ).modal();
				} else if (typeof data.addresses == "string"){
					window.location.replace('bmapi/logout');
				} else {
					data.addresses.forEach(function(value){
						$.scope.identities.push(value);
						$.scope.senders.push(value);
						addressLookup.push({
							name: value.identity,
							address: value.key
						});
					});
				}
			}
		});

		//show inbox message
		$('#inbox-list').on('click', '.new-message', function(e){
			// what default?
			e.preventDefault();

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
            $("#mess-subject").html(subject)
            $("#mess-body").html(body)
            $("#mess-date").html(date)
            $('#create_reply_button').show()
            $('#mess-reply').show()
            $('#delete_msg').attr('data-url','deleteInboxmessage')
            $('#messageModalLabel').html("Reply")

			if( the_message.read === 1 ) return ;
			apiCall({
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

		// not sure?
		$("#chan-form").submit(function(e){
			e.preventDefault();
			var info = {};
			info.form = $("#chan_name").val();
			$( '#chan-form' ).trigger('reset');
			apiCall({
				url: 'create_chan',
				data: info,
				callBack: function(data){
					$.scope.chans.push(data);
					$.scope.post_chan_list.push(data);
					$('#create_chan').modal('toggle');

				}
			});            
		});

		// populate chans list
		apiCall({
			url: 'allchans',
			callBack: function (data){
				if (typeof data.chans == "string") {
					window.location.replace('bmapi/logout');
				} else {
					data.chans.forEach(function(value) {
						$.scope.chans.push(value);
						$.scope.post_chan_list.push(value);
						addressLookup.push({
							name: value.chan_label,
							address: value.chan_address
						});
					});
					sessionStorage.setItem('chanNameList', JSON.stringify($.scope.chans));
				}
			}
		});

		// add new identity to list, select it
		$( '#create_id_button' ).click(function() {
			apiCall({
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
					$( '#create_id_form' ).trigger('reset');
				}
			});
		});

		// send a message
		$( '#compose_msg_form' ).on("submit", function(event) { // why not a submit?
			event.preventDefault();
            var form_data = $(this).serializeObject();
			$( '#compose_msg_form' ).trigger('reset');
			apiCall({
				url: 'send',
				data: form_data
			});
		});

        $( '#mess-view-form' ).on("submit", function(event) { // why not a submit?
            event.preventDefault();
            var form_data = $(this).serializeObject();
            form_data['send_addy'] = $("#mess-from").text()
            form_data['from_addy'] = $("#mess-to").text()
            form_data['subject'] = "Re: " + $("#mess-subject").text()
            $( '#compose_msg_form' ).trigger('reset');
            apiCall({
                url: 'reply',
                data: form_data
            });
        });

		// post message to chan, DRY out with above
		$( '#post_chan_form' ).on("submit", function(event) {
            event.preventDefault();
			var form_data = $(this).serializeObject();
			form_data.send_addy = 'chan_post';
			$( '#post_chan_form' ).trigger('reset');
			apiCall({
				url: 'send',
				data: form_data
			});
		});

		// delete inbox message
		$( '#delete_msg' ).click(function() {
            console.log($('#delete_msg').attr('data-url'))
                apiCall({
                    url: $('#delete_msg').attr('data-url'),
                    data: {
                        msgid: $( '#mess-id' ).val()
                    },
                    callBack: function(){
                        // update inbox
                        inboxMessages();
                    }
                });
        });

		// join chan
		$( '#sub_chan_btn' ).click(function() { // why not submit
			var info = {} ;
			info.label = $( '#chan_label' ).val();
			info.address = $( '#chan_addy' ).val();
			apiCall({
				url: 'joinchan',
				data: info,
				callBack: function (data){
					if ( 'error' in data ){
					} else {
						$.scope.chans.push(data);
						$.scope.post_chan_list.push(data);
					}
				}
			});
		});

		// show sent messages
		$('.inbox-nav').on( 'click', 'button#sent', function(){
            $('.inbox-bucket').children().hide();
            $.scope.sent.splice(0);
            apiCall({
                url: 'allsentmessages',
                callBack:function( data ){
                    data.messages.forEach( function(value){
                        value.data.forEach( function( value ){
                            value['receivedTime'] = convertUnixTime(value['lastactiontime'])
                            value['fromaddress'] = value['fromAddress']
                            value['toaddress'] = value['toAddress']
                            value['inboxmessage'] = stringShorter(value['message'])
                            value['inboxsubject'] = stringShorter(value['subject'])
                            $.scope.sent.push( value );
                        });
                    });
                }
            }).done(function(){
                sessionStorage.setItem('sentMessages', JSON.stringify($.scope.sent));
                $('#sent-mess').show(); 
            });
        });

		// show the chan tab
		$('#chan_tab').on( 'click', function(){
			$('.inbox-bucket').children().hide();
			$( this ).addClass( 'btn-material-blue-grey-100' );
			$( '#identityDrop' ).removeClass( 'btn-material-blue-grey-100' );
			$('#chan_mess').show();
			if ( $('#chan_tab').text() == 'No Chans Selected ') { // what is this doing?
				// $('#chan_ul_inbox_well > div').hide()
			}          
		});

		// select chans to display 
		$('#chan_ul').on( 'click', 'li.jq-repeat-chans > label', function(){
			var selected_chans = $('#chan_tab').text();
			var val = '.' + $( this ).parent().attr('data-chan-add');
			$( val ).toggle();
		});

		// select identities to show 
		$('#id_ul').on( 'click', 'li.jq-repeat-identities > label', function(){
			var selected_identities = $('#identityDrop').text();
			var val = '.' + $( this ).parent().attr('data-iden-key');
			$( val ).toggle();
		});

		$('#identityDrop').on( 'click', function(){
			$( this ).addClass( 'btn-material-blue-grey-100' );
			$( '#chan_tab' ).removeClass( 'btn-material-blue-grey-100' );
			inboxMessages();
		} );

		$('.inbox-nav').on( 'click', 'button#inbox', function(){
			inboxMessages();
		} );

		// add new address book entry
		$('[name="addAddressEntry"]').on( 'submit', function( event ){
			event.preventDefault();
			var formData = $( this ).serializeObject();
			apiCall({
				url: 'addAddressEntry',
				data: formData,
				callBack: function( data ){
					$.scope.addressBook.push( formData );
				}
			});
		});
        $('#sent-list').on('click', '.new-message', function(e){
            // what default?
            e.preventDefault();

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
            $("#mess-subject").html(subject)
            $("#mess-body").html(body)
            $("#mess-date").html(date)
            $('#create_reply_button').hide()
            $('#mess-reply').hide()
            $('#messageModalLabel').html("Sent Message")
            $('#delete_msg').attr('data-url','deleteSentmessage')
            processAddy( $("#mess-from").html( toaddress ) )

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
        });
	} );
})(jQuery);
