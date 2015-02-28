$(document).ready(function(){
    // populate chans list on page load
    localDB.getAllChanSubscriptions().done(function(data){
        if (data.length > 0){
            data.forEach(function(value) {
                $.scope.chans.push(value);
                $.scope.post_chan_list.push(value);
                $.scope.profileChans.push(value);
                addressLookup.push({
                    alias: value.label,
                    address: value.address
                });
            });
        }
    })

    // creates a chan
    $("#chan-form").submit(function(e){
        e.preventDefault();
        var info = {};
        info.form = $("#chan_name").val();
        $( '#chan-form' ).trigger('reset');
        util.apiCall({
            url: 'create_chan',
            data: info,
            callBack: function(data){
                $.scope.chans.push(data);
                $.scope.post_chan_list.push(data);
                $.scope.profileChans.push(data);
                $('#create_chan').modal('toggle');
                localDB.addChanSubscription(data)
            }
        });            
    });

    // join chan
    $( '#sub_chan_btn' ).click(function() { // why not submit
        var info = {} ;
        info.label = $( '#chan_label' ).val();
        info.address = $( '#chan_addy' ).val();
        util.apiCall({
            url: 'joinchan',
            data: info,
            callBack: function (data){
                if ( 'error' in data ){
                    console.log(data)
                } else {
                    $.scope.chans.push(data);
                    $.scope.post_chan_list.push(data);
                    $.scope.profileChans.push(data);
                    localDB.addChanSubscription(data)
                }
            }
        });
    });

    // post message to chan
    $( '#post_chan_form' ).on("submit", function(event) {
        event.preventDefault();
        var form_data = $(this).serializeObject();
        localDB.getChanAddress(form_data.chan_post_list).done(function(addy){
            form_data.to_address = form_data.from_address = addy;
            util.apiCall({
                url: 'send',
                data: form_data
            });
        })
        $("#compose_chan_post").toggle()
        $( '#post_chan_form' ).trigger('reset');
    });

    // select chans to display 
    $('#chan_ul').on( 'click', 'li.jq-repeat-chans > label', function(){
        var selected_chans = $('#chan_tab').text();
        var val = '.' + $( this ).parent().attr('data-chan-add');
        $( val ).toggle();
    });

    // show the chan tab
    $('#secondary').on( 'click', function(){
        $('#identityDrop').hide()
        $('.inbox-bucket').children().hide();
        $( '#primary' ).removeClass( 'btn-material-blue-grey-100' );
        $( this ).addClass( 'btn-material-blue-grey-100' );
        $('#chan_tab').show()
        $('#chan_mess').show();
        // this next line is not working.  whyyyyyyyyyy
        $( '.id_checks' ).prop('checked', false)
    });

    //remove chan
    $("#rmv_chan_form").submit(function(e){
        e.preventDefault();
        var form_data = $(this).serializeObject();
        util.apiCall({
            url: 'leave_chan',
            data: form_data,
            callBack: function(data){
                $('#remove_chan').modal('toggle');
                $("#" + form_data['label']).parent().remove()
            }
        });

    })
})
