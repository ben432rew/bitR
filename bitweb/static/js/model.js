// when a user signs up, a new database should be initialized with the username, 
// since that is a unique field name.  Orm if a user logs in and there is no 
// database with their username created

//  database should be locked and encrypted unless the user the database is 
// assigned to is signed in


db = new ydn.db.Storage('practicing', bitrSchema)