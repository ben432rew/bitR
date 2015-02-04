from django.contrib.auth.decorators import login_required
from django.conf.urls import patterns, include, url
from django.contrib import admin
from bmapi.views import *


urlpatterns = patterns('',
    url(r'^signup', Signup.as_view() ),
    url(r'^login', Login.as_view() ),
    url(r'^logout', login_required(Logout.as_view()), name="logout" ),    
    url(r'^allmessages', getInboxMessagesByUser.as_view() ),
    url(r'^allsentmessages', getSentMessageByUser.as_view() ),
    url(r'^identities', AllIdentitiesOfUser.as_view() ),
    url(r'^send', Send.as_view() ),
    url(r'^create_id', CreateId.as_view() ),
    url(r'^starred', Starred.as_view() ),
    url(r'^drafts', Drafts.as_view() ),
    url(r'^spam', Spam.as_view() ),
    url(r'^trash', Trash.as_view() ),
    url(r'^search', Search.as_view() ),
)
