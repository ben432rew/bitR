from django.contrib.auth.decorators import login_required
from django.conf.urls import patterns, include, url
from django.contrib import admin
from bitweb.views import *

urlpatterns = patterns('',
    url(r'^$', Index.as_view(), name="index" ),
    url(r'^signup', Signup.as_view(), name="signup" ),
    url(r'^login', Login.as_view(), name="login" ),
    url(r'^inbox', login_required(Inbox.as_view()), name="inbox" ),
    url(r'^profile', Profile.as_view(), name="profile" ),
    url(r'^logout', login_required(Logout.as_view()), name="logout" ),
)
