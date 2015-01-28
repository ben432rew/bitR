from django.conf.urls import patterns, include, url
from django.contrib import admin
from bitrest.views import *

urlpatterns = patterns('',
    url(r'^$', Index.as_view(), name="index" ),
    url(r'^signup', Signup.as_view(), name="signup" ),
    url(r'^login', Login.as_view(), name="login" ),
)
