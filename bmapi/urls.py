from django.contrib.auth.decorators import login_required
from django.conf.urls import patterns, include, url
from django.contrib import admin
from bmapi.views import *


urlpatterns = patterns('',
    url(r'^create_chan', CreateChan.as_view(), name="create_chan" ),
    url(r'^signup', Signup.as_view() ),
    url(r'^reply', Reply.as_view() ),
    url(r'^login', Login.as_view() ),
    url(r'^logout', login_required(Logout.as_view()), name="logout" ),    
    url(r'^allmessages', getInboxMessagesByUser.as_view() ),
    url(r'^allchans', AllChans.as_view() ),
    url(r'^allsentmessages', getSentMessageByUser.as_view() ),
    url(r'^identities', AllIdentitiesOfUser.as_view() ),
    url(r'^send', Send.as_view() ),
    url(r'^create_id', CreateId.as_view() ),
    url(r'^joinchan', JoinChan.as_view() ),
    url(r'^deleteInboxmessage', DeleteInboxMessage.as_view() ),
    url(r'^deleteSentmessage', DeleteSentMessage.as_view() ),
    url(r'^getInboxMessageByID', getInboxMessageByID.as_view() ),
    url(r'^addAddressEntry', addAddressEntry.as_view() ),
    url(r'^deleteAddressEntry', deleteAddressEntry.as_view() ),
    url(r'^GetAddressBook', GetAddressBook.as_view() ), 
)
