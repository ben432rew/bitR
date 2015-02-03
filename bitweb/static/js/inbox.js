$(document).ready(function(){
    $.material.ripples();
    $('.dropdown-toggle').dropdown();

    var tokenValue = {'token': $.cookie('token') }

//  just for testing, needs to be changed to only get messages for specific user
    $.get('/bmapi/allmessages', function (data){
        data['messages']['data'].forEach(function(value) {
            $.scope.inbox.push(value)
        })
    })
    $.post('/bmapi/identities', JSON.stringify(tokenValue), function (data){
        if (data['addresses'] == 'none'){
// if there aren't any identities that the user has (like if they just signed up),
// then they should just see the create identities modal (UNFINISHED)
            $( '#create_identitiy' ).modal('show')
            console.log("here")
        } else if (data['addresses'] == 'invalid token given') {
            console.log('there')
            window.location.replace('bmapi/logout');
        } else {
            data['addresses'].forEach(function(value) {
                $.scope.identities.push(value)
            })
        }
    })

    $(".identity-inbox").click(function(event){
        event.preventDefault();
        console.log("INDENTITY IONBOX")
        var href = $(this).find("a")[0].attr("href")
        $.get(href, function(data){
            console.log(data)
            $.scope.inbox.push(data)
        })
    })


// add new identity to list, select it
    $( '#create_id_button' ).click(function() {
        var info = tokenValue;
        console.log('HEY')
        info['identity'] = $( '#identity_name' ).val();
        $.post('/bmapi/create_id', JSON.stringify(info), function (data){
            console.log(data);
            $.scope.identities.push(info)
        })
// clear inbox and chans (UNFINISHED)
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
