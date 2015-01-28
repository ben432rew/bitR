from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    url(r'^$', Index.as_view(), name="index" ),
    url(r'^$', login_required( Index.as_view() ), name="index" ),
)
