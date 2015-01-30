from django.contrib.auth.decorators import login_required
from django.conf.urls import patterns, include, url
from django.contrib import admin
from bitweb.views import *

urlpatterns = patterns('',
    url(r'^$', Index.as_view(), name="index" ),
    url(r'^inbox', login_required(Inbox.as_view()), name="inbox" ),
    url(r'^signup', Signup.as_view(), name="signup" ),
    url(r'^login', Login.as_view(), name="login" ),
    url(r'^logout', Logout.as_view(), name="logout" ),
)
