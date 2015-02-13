//  database should be locked and encrypted unless the user the database is 
// assigned to is signed in

var db = new ydn.db.Storage($('#username').attr('data-username'), bitrSchema)

var localDB = {

    createAddress : function(entry){
        db.put('addressbook', {address:entry['address'], alias:entry['alias']})
    },

    getAddressBook : function(){
        return db.values('addressbook').done(function(i){return i})
    }
}