var test;

$(document).ready(function(){
    $.material.ripples();
    $('.dropdown-toggle').dropdown();

    var tokenValue = {'token': $.cookie('token') }

//  just for testing, needs to be changed to only get messages for specific user
    $.get('/bmapi/allmessages', function (data){
        data['messages']['data'].forEach(function(value) {
            $.scope.inbox.push(value);
        })
    })
    $.post('/bmapi/identities', JSON.stringify(tokenValue), function (data){
        test = data;
        if (data['addresses'].length === 0 ){
// if there aren't any identities that the user has (like if they just signed up),
// then they should just see the create identities modal (UNFINISHED)
            $( '#create_identity' ).modal();
            console.log("here")
        } else if (data['addresses'] == 'invalid token given') {
            console.log('there')
            window.location.replace('bmapi/logout');
        } else {
            data['addresses'].forEach(function(value) {
                console.log(value)
                $.scope.identities.push(value)
                $.scope.senders.push(value)
            })
        }
    })

    $( '#create_id_button' ).click(function() {
        var info = tokenValue;
        info['nickname'] = $( '#identity_name' ).val();
        $.post('/bmapi/create_id', JSON.stringify(info), function (data){
// add new identity to list, select it
            })
// clear inbox and chans (UNFINISHED)
    })

    $( '#send_message_btn' ).click(function() {
        var info = tokenValue;
        info['to_address'] = $( '#send_addy' ).val();
        info['from'] = $( '#from_addy' ).val();
        info['subject'] = $( '#subject' ).val();
        info['message'] = $( '#message' ).val();
        $.post('/bmapi/send', JSON.stringify(info), function (data){
            console.log("HERE AT THE END")
// add message to sent messages folder
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

    $( '#logout-btn' ).click(function(){
        $.removeCookie('token');
    })

});
