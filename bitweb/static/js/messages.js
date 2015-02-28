$(document).ready(function(){
    // send a message
    $( '#compose_msg_form' ).on("submit", function(event) {
        event.preventDefault();
        var form_data = $(this).serializeObject();
        $( '#compose_msg_form' ).trigger('reset');
        $("#compose_msg").toggle()
        util.apiCall({
            url: 'send',
            data: form_data,
        });
    });

    // reply to message
    $( '#mess-view-form' ).on("submit", function(event) {
        event.preventDefault();
        var messages = JSON.parse(sessionStorage.getItem('inboxMessages'));
        var message;
        var msgid = $( '#mess-id' ).val();
        // this is repeating another loop, can be dried out
        for (var i=0; i<messages.length; i++ ){
            if (messages[i]['msgid'] == msgid){
                message = messages[i];
            }
        }
        var form_data = $(this).serializeObject();
        form_data['to_address'] = message['fromAddress']
        form_data['from_address'] = message['toAddress']
        form_data['subject'] = "Re: " + message['subject']
        form_data['message'] = form_data['reply']
        $( '#compose_msg_form' ).trigger('reset');
        util.apiCall({
            url: 'send',
            data: form_data,
            callBack:function (data){
            $("#mess_view_modal").toggle()
        }
        });
    });

    // delete inbox message
    $( '#delete_msg' ).click(function() {
        util.apiCall({
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
})