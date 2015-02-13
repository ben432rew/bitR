//  database should be locked and encrypted unless the user the database is 
// assigned to is signed in

var username = $('#username').attr('data-username')

var db = new ydn.db.Storage(username, bitrSchema)

var localDB = {}

localDB.createAddress = function(entry){
    db.put('addressbook', {address:entry['address'], alias:entry['alias']})
}

localDB.getAddresses = function(){
    return db.values('addressbook').done(function(i){return i})
}