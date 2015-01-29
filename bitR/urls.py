from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', include('bitrest.urls', namespace='bitrest')),
    url(r'^bitmess/', include('bitmess.urls', namespace='bitmess')),
)
