from django.contrib.auth.decorators import login_required
from django.conf.urls import patterns, include, url
from django.contrib import admin
from bmapi.views import *


urlpatterns = patterns('',
    url(r'^allmessages', AllMessages.as_view(), name="allmessages" ),
    url(r'^signup', Signup.as_view(), name="signup" ),
    url(r'^login', Login.as_view(), name="login" ),
    url(r'^logout', login_required(Logout.as_view()), name="logout" ),    
    url(r'^send', Send.as_view(), name="send" ),
    url(r'^identities', AllIdentitiesOfUser.as_view(), name="identities" ),
    url(r'^search', Search.as_view(), name="search" ),
    url(r'^starred', Starred.as_view(), name="starred" ),
    url(r'^sent', Sent.as_view(), name="sent" ),
    url(r'^drafts', Drafts.as_view(), name="drafts" ),
    url(r'^spam', Spam.as_view(), name="spam" ),
    url(r'^trash', Trash.as_view(), name="trash" ),
    url(r'^create_id', CreateId.as_view(), name="create" ),
    url(r'^inbox/(?P<identity>\w+)', AllMessagesByAddy.as_view(), name="inbox" ),
)
