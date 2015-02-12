// when a user signs up, a new database should be initialized with the username, 
// since that is a unique field name.  Orm if a user logs in and there is no 
// database with their username created

//  database should be locked unless the user the database is assigned to is 
//  signed in

var schema = {
  stores: [{
    name: 'addressbook',
    indexes: [{
            name: 'address'
        }, {
            name: 'alias'
    }]}, {
    name: 'chan_subscriptions',
    indexes: [{
            name: 'label'
        }, {
            name: 'address'
        }]
    }, {
    name: 'inbox_messages',
    indexes: [{
            name: 'message'
        }, {
            name: 'read'
        }, {
            name: 'toAddress'
        }, {
            name: 'receivedTime'
        }, {
            name: 'fromAddress'
        }, {
            name: 'subject'
        }, {
            name: 'msgid'
        }, {
            name: 'color'
        }, {
            name: 'inboxToAddress'
        }, {
            name: 'inboxMessage'
        }, {
            name: 'inboxSubject'
        }, {
            name: 'inboxFromAddress'
        }]
    }, {
    name: 'sent_messages',
    indexes: [{
            name: 'message'
        }, {
            name: 'status'
        }, {
            name: 'toAddress'
        }, {
            name: 'receivedTime'
        }, {
            name: 'fromAddress'
        }, {
            name: 'subject'
        }, {
            name: 'msgid'
        }, {
            name: 'inboxMessage'
        }, {
            name: 'inboxSubject'
        }, {
            name: 'inboxFromAddress'
        }, {
            name: 'inboxToAddress'
        }]
    }, {
    name: 'chanMessages',
    indexes: [{
            name: 'message'
        }, {
            name: 'read'
        }, {
            name: 'toAddress'
        }, {
            name: 'receivedTime'
        }, {
            name: 'fromAddress'
        }, {
            name: 'subject'
        }, {
            name: 'msgid'
        }, {
            name: 'chan'
        }, {
            name: 'color'
        }, {
            name: 'inboxMessage'
        }, {
            name: 'inboxSubject'
        }, {
            name: 'inboxFromAddress'
        }, {
            name: 'inboxToAddress'
        }]
    }
  ]

db = new ydn.db.Storage('practicing', schema)