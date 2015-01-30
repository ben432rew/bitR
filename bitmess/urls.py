from django.contrib.auth.decorators import login_required
from django.conf.urls import patterns, include, url
from django.contrib import admin
from bitmess.views import *

urlpatterns = patterns('',
    url(r'^(?P<user_id>[\d]+)', login_required(Inbox.as_view()), name="inbox" ),
    url(r'^search', login_required(Search.as_view()), name="search" ),
    url(r'^settings/(?P<user_id>[\d]+)', login_required(Settings.as_view()), name="settings" ),
    url(r'^starred/(?P<user_id>[\d]+)', login_required(Starred.as_view()), name="starred" ),
    url(r'^sent/(?P<user_id>[\d]+)', login_required(Sent.as_view()), name="sent" ),
    url(r'^drafts/(?P<user_id>[\d]+)', login_required(Drafts.as_view()), name="drafts" ),
    url(r'^spam/(?P<user_id>[\d]+)', login_required(Spam.as_view()), name="spam" ),
    url(r'^trash/(?P<user_id>[\d]+)', login_required(Trash.as_view()), name="trash" ),
)
