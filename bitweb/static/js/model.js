var db = new ydn.db.Storage($('#username').attr('data-username'), bitrSchema)

var localDB = {

    createAddress: function(entry){
        db.put('addressbook', {address:entry['address'], alias:entry['alias']})
    },

    getAddressBook: function(){
        return db.values('addressbook').done(function(i){return i})
    },

    addSentMessage: function(entry){

    },

    getSentMessage: function(msgid){

    },

    getAllSentMessages: function(){
        
    },

    addChanSubscription: function(entry){
        db.put('chan_subscriptions', {address:entry['chan_address'], label:entry['chan_label']})
    },

    getAllChanSubscriptions: function(){
        return db.values('chan_subscriptions').done(function(i){return i})        
    }
}