// after indexedDB is complete, replace this array with database lookups
var addressLookup = [];

var adrs = {
    addressCheck: function(string2check){
        var matcher = /BM-[a-zA-Z0-9]+/ ;
        if( typeof(string2check) == 'string' && string2check.match(matcher) ){
            return true;
        }
    },

    processAddy: function( address, len ){
        var index = $.scope.addressBook.indexOf.call( addressLookup, 'address', address );
        if( index !== -1 ){
            address = addressLookup[index].alias;
        }
        
        return address ;
    },

    convertAddress: function( $element ){
        var address = $element.html();
        $element.data( 'address', address );
        address = this.processAddy( address );
        address = util.stringShorter( address );
        $element.html( address );
    },

    parseNodes: function( $start ){
        $start = $start || $( 'body' );
        $start.find('.addyBook').each( function( $element ){
            this.convertAddress( $element )
        });
    },

    insertAddresses: function(){
        $(document).on('DOMNodeInserted', function(event) {
            if ( $( event.target ).is('.addyBook') ){
                adrs.convertAddress( $( this ) );
            }else{
                $( event.target ).find( '.addyBook' )
                    .each(function( key, value ){
                        adrs.convertAddress( $( value ) );
                    });
            }
        });
    },

    addressesBook: function(){
        localDB.getAddressBook().done(function(book){
            $.scope.addressBook.push.apply( $.scope.addressBook, book );
            addressLookup.push.apply( addressLookup, book );
        })
        this.insertAddresses()
    }

}


// add new address book entry
$('[name="addAddressEntry"]').on( 'submit', function( event ){
    event.preventDefault();
    var formData = $( this ).serializeObject();
    if( !adrs.addressCheck( formData.address ) ){
        alert("Malformed address.");
        return false;
    }

    if( $.scope.addressBook.indexOf.call( addressLookup, 'address', formData.address ) !== -1 ){
        alert("Address already in use.");
        return false;
    }
    localDB.createAddress(formData)
    $.scope.addressBook.push( formData );
    $('[name="addAddressEntry"]')[0].reset();

});

// delete address book entry
$('#addressBookModal').on( 'click', 'button.delete', function(){
    var alias = $( this ).parents( '[jq-repeat-index]' ).attr( 'data-alias' );
    db.remove('addressbook', alias).done(function(){
        var index = $.scope.addressBook.indexOf( 'alias', alias );
        $.scope.addressBook.splice( index, 1 );
    })
});
