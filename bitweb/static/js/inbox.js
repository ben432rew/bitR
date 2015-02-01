$(document).ready(function(){
    var options = {
        "backdrop" : "static",
        "keyboard" : "true",
        "show"     : "true"
    }
    var user_id = {'user_id':$( '#user_id' ).val()};
    var identities;

    $( '#create_identitiy' ).modal(options)
    $.material.ripples();
    $('.dropdown-toggle').dropdown();
    $.get('/bmapi/allmessages', function (data){
        data['messages'].forEach(function(value) {
            $.scope.inbox.push(value)
        })
    })
// doesn't work as is
    $.get('/bmapi/identities', JSON.stringify(user_id), function (data){
        if (data){
            identities = data
            data['indentities'].forEach(function(value) {
                $.scope.identities.push(value)
            })
        } else {
            $( '#create_identitiy' ).modal('show')
        }
    })
});
