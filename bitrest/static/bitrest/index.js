$(document).ready(function(){
    $( ".signup" ).hide();
    $('#signup').on('click', function(e) {
        $( ".login" ).hide();
        $( ".signup" ).slideUp();
    })
    $('#login').on('click', function(e) {
        $( ".signup" ).hide();
        $( ".login" ).slideUp();
    })    
});
