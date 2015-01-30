from django.conf.urls import patterns, include, url
from django.contrib import admin
from bmapi.views import *

urlpatterns = patterns('',
    url(r'^allmessages', AllMessages.as_view(), name="allmessages" ),
    url(r'^search', Search.as_view(), name="search" ),
    url(r'^settings', Settings.as_view(), name="settings" ),
    url(r'^starred', Starred.as_view(), name="starred" ),
    url(r'^sent', Sent.as_view(), name="sent" ),
    url(r'^drafts', Drafts.as_view(), name="drafts" ),
    url(r'^spam', Spam.as_view(), name="spam" ),
    url(r'^trash', Trash.as_view(), name="trash" ),
)
