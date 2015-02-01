from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect
from bitweb.forms import UserCreateForm
from django.views.generic import View
from bmapi.models import *
from bitweb.models import User
import uuid

class Index( View ):
    def get(self, request):
        if not request.user.is_anonymous():
            return redirect ( '/inbox' )
        return render ( request, 'bitweb/index.html', {'signup':UserCreateForm(), 'login':AuthenticationForm()} )


class Signup( View ):
    def post(self, request):
        form = UserCreateForm( request.POST )
        if form.is_valid():
            form.save()
            user = authenticate(username = request.POST["username"], password=request.POST["password1"])
            login(request, user)
            token = Token.objects.create(token = uuid.uuid4(), user = user)            
            return redirect( '/inbox' )
        return render ( request, 'bitweb/index.html', {'signup':UserCreateForm(), 'login':AuthenticationForm(), 'error':"Sorry, you didn't enter valid signup information"} )


class Login( View ):
    def post(self, request):
        form = AuthenticationForm( request, request.POST )
        if form.is_valid():
            user = authenticate(username=request.POST["username"], password=request.POST["password"])
            login(request, user)
            token = Token.objects.create(token = uuid.uuid4(), user = user)     
            return redirect('/inbox')
        return render ( request, 'bitweb/index.html', {'signup':UserCreateForm(), 'login':AuthenticationForm(), 'error':"Sorry, you didn't enter valid login information"} )


class Inbox( View ):
    def get(self, request):
        return render (request, 'bitweb/inbox.html')


class Profile( View ):
    def get(self, request):
        identities = request.user.bitkey_set.all()
        return render (request, 'bitweb/profile.html', {'identities':identities})


class About( View ):
    pass


class FAQ( View ):
    pass


class Press( View ):
    pass


class Blog ( View ):
    pass
    

class Logout( View ):
    def get( self, request ):
        request.user.token_set.all().delete()
        logout( request )
        return render ( request, 'bitweb/index.html', {'signup':UserCreateForm(), 'login':AuthenticationForm()} )
