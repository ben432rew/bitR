from django.contrib.auth.decorators import login_required
from django.conf.urls import patterns, include, url
from django.contrib import admin
from bmapi.views import *


urlpatterns = patterns('',
    url(r'^signup', Signup.as_view(), name="signup" ),
    url(r'^login', Login.as_view(), name="login" ),
    url(r'^logout', login_required(Logout.as_view()), name="logout" ),    
    url(r'^allmessages', getInboxMessagesByUser.as_view(), name="getInboxMessagesByUser" ),
    url(r'^allsentmessages', getSentMessageByUser.as_view(), name="getSentMessageByUser" ),
    url(r'^identities', AllIdentitiesOfUser.as_view(), name="identities" ),
    url(r'^send', Send.as_view(), name="send" ),
    url(r'^create_chan', CreateChan.as_view(), name="create_chan" ),
    url(r'^create_id', CreateId.as_view(), name="create" ),
    url(r'^starred', Starred.as_view(), name="starred" ),
    url(r'^drafts', Drafts.as_view(), name="drafts" ),
    url(r'^spam', Spam.as_view(), name="spam" ),
    url(r'^trash', Trash.as_view(), name="trash" ),
    url(r'^search', Search.as_view(), name="search" ),
)
