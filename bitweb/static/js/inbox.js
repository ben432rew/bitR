$(document).ready(function(){

    $('.dropdown-toggle').dropdown();

    var tokenValue = {'token': $.cookie('token') }

//  just for testing, needs to be changed to only get messages for specific user
    $.post('/bmapi/allmessages', JSON.stringify(tokenValue), function (data){
        console.log(data)
        data['messages'].forEach(function(value) {
            value['data'].forEach(function(value){
                $.scope.inbox.push(value);
            });
        })
        sessionStorage.setItem('inboxMessages', JSON.stringify($.scope.inbox));
    })
    $.post('/bmapi/identities', JSON.stringify(tokenValue), function (data){
        if (data['addresses'].length === 0 ){
// if there aren't any identities that the user has (like if they just signed up),
// then they should just see the create identities modal (UNFINISHED)
            $( '#create_identity' ).modal();
        } else if (data['addresses'] == 'invalid token given') {
            window.location.replace('bmapi/logout');
        } else {
            data['addresses'].forEach(function(value) {
                $.scope.identities.push(value)
                $.scope.senders.push(value)
            })
        }
    })


// add new identity to list, select it
    $( '#create_id_button' ).click(function() {
        var info = tokenValue;
        info['identity'] = $( '#identity_name' ).val();
        console.log('HEY')
        $.post('/bmapi/create_id', JSON.stringify(info), function (data){
            console.log(data);
            $.scope.identities.push(info)
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

    console.log($("#inbox-mess").text())

});
