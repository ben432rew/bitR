$(document).ready(function(){
    $.material.ripples()
    $('.dropdown-toggle').dropdown()
    $.get('/bmapi/allmessages', function (data){
        data['messages'].forEach(function(value) {
            $.scope.inbox.push(value)
        })
    })
    // $.get('/bmapi/identities', function (data){
    //     data['messages'].forEach(function(value) {
    //         $.scope.identities.push(value)
    //     })
    // })
});
