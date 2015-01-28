from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.views.generic import View


class Index( View ):
    def get(self, request):
        if not request.user.is_anonymous():
            return redirect ( '/bitmess/' + str(request.user.id) )
        return render ( request, 'bitrest/index.html', {'signup':UserCreationForm(), 'login':AuthenticationForm()})


class Signup( View ):
    def post(self, request):
        form = UserCreationForm( request.POST )
        if form.is_valid():
            form.save()
            user = authenticate(username = request.POST["username"], password=request.POST["password1"])
            login(request, user)
            return redirect( '/bitmess/' + str(request.user.id) )
        else:
            return render ( request, 'bitrest/index.html', {'signup':UserCreationForm(), 'login':AuthenticationForm(), "error":"Incorrect Input"})


class Login( View ):
    def post(self, request):
        form = AuthenticationForm( request, request.POST )
        if form.is_valid():
            user = authenticate(username=request.POST["username"], password=request.POST["password"])
            login(request, user)
            return redirect('/bitmess/' + str(user.id))
        else:
            return render ( request, 'bitrest/index.html', {'error': 'Incorrect Login', 'signup':UserCreationForm(), 'login':AuthenticationForm(), "error":"Incorrect Input"})


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
        logout( request )
        return redirect( '/')  