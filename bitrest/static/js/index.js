$(document).ready(function(){
    $( ".signup" ).hide();
    $('#signup').on('click', function(e) {
        $( ".login" ).hide('medium');
        $( ".signup" ).show('medium');
    })
    $('#login').on('click', function(e) {
        $( ".signup" ).hide('medium');
        $( ".login" ).show('medium');
    })

    $("input").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $("form").submit();
        }
	});

});
