$(document).ready(function(){
    $.material.ripples()
    $.get('/bmapi/allmessages', function (data){
        console.log("here")
        data['messages'].forEach(function(value) {
            $.scope.inbox.push(value)
        })
    })
});
