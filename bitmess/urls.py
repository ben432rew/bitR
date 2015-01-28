from django.conf.urls import patterns, include, url
from django.contrib import admin
from bitmess.views import *

urlpatterns = patterns('',
    url(r'^(?P<user_id>[\d]+)', Inbox.as_view(), name="inbox" ),
)
