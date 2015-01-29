$(document).ready(function(){
    $( ".signup" ).hide();
    $('#signup').on('click', function(e) {
        $( ".login" ).hide();
        $( ".signup" ).show();
    })
    $('#login').on('click', function(e) {
        $( ".signup" ).hide();
        $( ".login" ).show();
    })    
});
