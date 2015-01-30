from django.views.generic import View
from django.http import JsonResponse
from django.shortcuts import render
from bmapi.wrapperAPI import API


#getting all messages from client, not really usefull, only for testing
class AllMessages( View ):
    def get(self, request):
        api = API()
        return JsonResponse ( {'messages': api.getAllMessages()} )


# this probably should be in the wrapper, but for now it's here.  This will: 
# be given a list of currently logged in identities.  It will check for new
# messages for those identities by checking the receivedTime against one minute
# ago, and if there are any messages since the last minute, sends them to the 
# user's browsers inbox
class EveryMinute( View ):
    pass


# send an email
class Send ( View ):
    pass


# given an identity, will return all messages that are associated
class MessagesByIdentity( View ):
    pass


#for searching in the current emails a user has
class Search( View ):
    pass


#get all started, use post to star or unstar
class Starred( View ):
    pass


#see all sent messages
class Sent( View ):
    pass


#see all drafts
class Drafts( View ):
    pass


#see spam folder as get, post to make something spam or unspam something
class Spam( View ):
    pass


#get to see trash, post to trash or untrash something
class Trash( View ):
    pass