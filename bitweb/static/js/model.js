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

    addInboxMessage: function(entry){

    },

    getInboxMessage: function(msgid){

    },

    getAllInboxMessages: function(){
        
    },

    addChanSubscription: function(entry){
        db.put('chan_subscriptions', {address:entry['address'], label:entry['label']})
    },

    getAllChanSubscriptions: function(){
        return db.values('chan_subscriptions').done(function(i){return i})
    },

    getChanAddress: function(chan_label){
        return db.get('chan_subscriptions', chan_label).done(function(addy){
                return addy['address']
            })
    },
}
