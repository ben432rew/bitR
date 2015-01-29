from django.views.generic import View
from django.shortcuts import render


class Inbox( View ):
    def get(self, request, user_id):
        return render ( request, 'bitmess/inbox.html' )