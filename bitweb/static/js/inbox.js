$(document).ready(function(){
    var user_id = {'user_id':$( '#user_id' ).val()};
    
    $.material.ripples();
    $('.dropdown-toggle').dropdown();

    $.get('/bmapi/allmessages', function (data){
        data['messages'].forEach(function(value) {
            $.scope.inbox.push(value)
        })
    })

    $.post('/bmapi/identities', JSON.stringify(user_id), function (data){
        if (data['addresses'] == undefined){
// if there aren't any identities that the user has (like if they just signed up),
// then they should just see the create identities modal (UNFINISHED)
            $( '#create_identitiy' ).modal('show')
            console.log("here")
            console.log(data['addresses'])
        } else {
            data['addresses'].forEach(function(value) {
                $.scope.identities.push(value)
            })
            console.log(data['addresses'])
            console.log('there')
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
