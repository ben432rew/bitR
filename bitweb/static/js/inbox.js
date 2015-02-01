$(document).ready(function(){
    $.material.ripples()
    $.get('/bmapi/allmessages', function (data){
        data['messages'].forEach(function(value) {
            $.scope.inbox.push(value)
        })
    })
});
