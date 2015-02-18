from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect
from bmapi.forms import UserCreateForm
from django.views.generic import View
from pprint import pprint


class Index( View ):
    def get(self, request):
        if not request.user.is_anonymous():
            return redirect ( '/inbox' )
        return render ( request, 'bitweb/index.html', {'signup':UserCreateForm(), 'login':AuthenticationForm()} )


class Inbox( View ):
    def get(self, request):
        return render (request, 'bitweb/inbox.html')


class Profile( View ):
    def get(self, request):
        identities = request.user.bitkey_set.all()
        return render (request, 'bitweb/profile.html', {'identities':identities})


class About( View ):
    def get(self, request):
        return render ( request, 'bitweb/about.html' )
