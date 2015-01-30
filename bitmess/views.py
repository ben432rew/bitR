from django.views.generic import View
from django.shortcuts import render


class Inbox( View ):
    def get(self, request, user_id):
        return render ( request, 'bitmess/inbox.html' )

class Search( View ):
    def get(self, request, user_id):
        return render ( request, 'bitmess/inbox.html' )

class Settings( View ):
    def get(self, request, user_id):
        return render ( request, 'bitmess/inbox.html' )

class Starred( View ):
    def get(self, request, user_id):
        return render ( request, 'bitmess/inbox.html' )

class Sent( View ):
    def get(self, request, user_id):
        return render ( request, 'bitmess/inbox.html' )

class Drafts( View ):
    def get(self, request, user_id):
        return render ( request, 'bitmess/inbox.html' )

class Spam( View ):
    def get(self, request, user_id):
        return render ( request, 'bitmess/inbox.html' )

class Trash( View ):
    def get(self, request, user_id):
        return render ( request, 'bitmess/inbox.html' )