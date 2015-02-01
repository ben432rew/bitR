$(document).ready(function(){
    var user_id = $( '#user_id' ).val();
    var identities;

    $( '#create_identitiy' ).hide()
    $.material.ripples();
    $('.dropdown-toggle').dropdown();
    $.get('/bmapi/allmessages', function (data){
        data['messages'].forEach(function(value) {
            $.scope.inbox.push(value)
        })
    })
// untested
    $.get('/bmapi/identities', function (data){
        if (data){
            data['indentities'].forEach(function(value) {
                $.scope.identities.push(value)
        } else {
// here the rest of the page should be darkened or faded
            $( '#create_identitiy' ).show()
        }
        })
    })
});
