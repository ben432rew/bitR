from django.views.generic import View
from django.shortcuts import render


class Inbox( View ):
    def get(self, request, user_id):
        return render ( request, 'bitmess/inbox.html' )

class Search( View ):
	pass

class Settings( View ):
	pass

class Starred( View ):
	pass

class Sent( View ):
	pass

class Drafts( View ):
	pass

class Spam( View ):
	pass

class Trash( View ):
	pass