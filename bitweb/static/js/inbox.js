$(document).ready(function(){
    var options = {
        "backdrop" : "static",
        "keyboard" : "true",
        "show"     : "true"
    }
    var user_id = {'user_id':$( '#user_id' ).val()};
    var identities;

    $( '#create_identitiy' ).modal(options)
    $( '#create_chan' ).modal(options)
// this next line is a bug, it shouldn't be neccessary.  if it's not here, the 
// chan modal automatically appears on page load
    $( '#create_chan' ).modal('hide')
    $.material.ripples();
    $('.dropdown-toggle').dropdown();

    $.get('/bmapi/allmessages', function (data){
        data['messages'].forEach(function(value) {
            $.scope.inbox.push(value)
        })
    })
// doesn't work as is (UNFINISHED)
    $.post('/bmapi/identities', JSON.stringify(user_id), function (data){
        console.log(data)
        if (data){
            identities = data
            data['indentities'].forEach(function(value) {
                $.scope.identities.push(value)
            })
// if there aren't any identities that the user has (like if they just signed up),
// then they should just see the create identities modal (UNFINISHED)
        } else {
            $( '#create_identitiy' ).modal('show')
        }
    })


    $( '#create_id_button' ).click(function() {
        var info = user_id;
        info['nickname'] = $( '#identity_name' ).val();
        $.post('/bmapi/create_id', JSON.stringify(info), function (data){
            })
// clear inbox and chans (UNFINISHED)
    })

    $( '#create_chan_button' ).click(function() {
// send json to createchan function
// set new chan as active chan in chan tab
    })

    $( '#refresh-btn' ).click(function() {
// check for new messages
    })

});
