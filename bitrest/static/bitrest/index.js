$(document).ready(function(){
    $( "#signup_modal" ).hide();
    $('#signup_button').on('click', function(e) {
        $( ".views" ).slideUp()
        $("#signup_modal").slideDown()
    })
    $('#login_button').on('click', function(e) {
        $( ".views" ).slideUp()
        $("#login_modal").slideDown()
    })
});
