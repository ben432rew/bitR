from django.conf.urls import patterns, include, url
from django.contrib import admin
from bitmess.views import *

urlpatterns = patterns('',
    url(r'^(?P<user_id>[\d]+)', Inbox.as_view(), name="inbox" ),
    url(r'^search', Search.as_view(), name="search" ),
    url(r'^settings/(?P<user_id>[\d]+)', Settings.as_view(), name="settings" ),
    url(r'^starred/(?P<user_id>[\d]+)', Starred.as_view(), name="starred" ),
    url(r'^sent/(?P<user_id>[\d]+)', Sent.as_view(), name="sent" ),
    url(r'^drafts/(?P<user_id>[\d]+)', Drafts.as_view(), name="drafts" ),
    url(r'^spam/(?P<user_id>[\d]+)', Spam.as_view(), name="spam" ),
    url(r'^trash/(?P<user_id>[\d]+)', Trash.as_view(), name="trash" ),
)
