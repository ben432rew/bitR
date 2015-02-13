// when a user signs up, a new database should be initialized with the username, 
// since that is a unique field name.  Orm if a user logs in and there is no 
// database with their username created

//  database should be locked and encrypted unless the user the database is 
// assigned to is signed in

var db = new ydn.db.Storage('practicing', bitrSchema)

var localDB = {}

localDB.createAddress = function(entry){
    db.put('addressbook', {address:entry['address'], alias:entry['alias']})
}

localDB.getAddresses = function(){
    return db.values('addressbook').done(function(i){return i})
}