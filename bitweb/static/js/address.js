var adrs = {
    addressCheck: function(string2check){
        var matcher = /^BM-[\w]{34}$/ ;
        if( typeof(string2check) == 'string' && string2check.match(matcher) ){
            return true;
        }
    },

    convertAddress: function( $element ){
        var address = $element.html();
        if( this.addressCheck( address ) ){
            $element.data( 'address', address );
        }else{
            if( $element.data('address') ){
                address = $element.data('address');
            }
        }
        if( !this.addressCheck(address) ) return ;
        localDB.getAliasFromAddressBook(address).done(function(lookUp){
            $element.html( util.stringShorter( lookUp ) );
            for ( var i=0; i<$.scope.identities.length; i++ ) {
                if ( lookUp == $.scope.identities[i].key ) {
                    $element.html( util.stringShorter( $.scope.identities[i].identity ) );
                }
            }
        })
    },

    // goes through nodes, checks for addyBook class, adds address book entry
    parseNodes: function( $start ){
        $start = $start || $( 'body' );
        $start.find('.addyBook').each( function( index, element ){
            adrs.convertAddress( $( element ) );
        });
    },

    addressesBook: function(){
        localDB.getAddressBook().done(function(book){
            $.scope.addressBook.push.apply( $.scope.addressBook, book );
            adrs.parseNodes();
        })
    }
};

// calls parseNodes if new elements are added to the DOM
$(document).on('DOMNodeInserted', function(event) {
    adrs.parseNodes( $(event.target) )
});

$(document).ready(function(){
    // add new address book entry
    $('[name="addAddressEntry"]').on( 'submit', function( event ){
        event.preventDefault();
        var formData = $( this ).serializeObject();
        if( !adrs.addressCheck( formData.address ) ){
            alert("Malformed address.");
            return false;
        }
        for ( var i=0; i<$.scope.addressBook.length; i++ ) {
            if ( $.scope.addressBook[i]['address'] == formData.address ){
                alert("Address already in use.");
                return false;
            }
        }
        localDB.createAddress(formData)
        $.scope.addressBook.push( formData );
        $('[name="addAddressEntry"]')[0].reset();
        adrs.parseNodes();

    });

    // delete address book entry
    $('#addressBookModal').on( 'click', 'button.delete', function(){
        var address = $( this ).parents( '[jq-repeat-index]' ).attr( 'data-address' );
        localDB.removeAddress(address).done(function(returned){
            var index = $.scope.addressBook.indexOf( 'address', address );
            $.scope.addressBook.splice( index, 1 );
        })
    });
})