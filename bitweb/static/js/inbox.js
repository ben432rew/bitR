$(document).ready(function(){
    $.material.ripples()
    $.get('/bitmess/messages', function (data){
        console.log("is there anything?")
        console.log(data)
        data['messages'].forEach(function(value) {
            $.scope.inbox.push(value)
        })
    })
});
