from bmapi.models import Token, BitKey
from django.views.generic import View
from django.http import JsonResponse
from django.shortcuts import render
from bmapi.wrapperAPI import API
from bitweb.models import User
from datetime import datetime
import json

# check if the token is in the database and if it's expired (older than 5 hours)
def check_token (token):
    if Token.objects.filter(token=token).exists():
        if Token.objects.get(token=token).created_at > datetime.now() - datetime.timedelta(hours=5):
            return True
    return False

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


class CreateId( View ):
    api = API()
    
    def post( self, request ):
        label = request.body.decode('utf-8')
        newaddy = self.api.createRandomAddress(the_jason['nickname'])
        bitty = BitKey.objects.create(name=the_jason["nickname"], key=newaddy, user=user)
        return JsonResponse( { 'id' : self.api.createRandomAddress(label) } )
        the_jason = json.loads(request.body.decode('utf-8'))
        user = User.objects.get(pk=the_jason['user_id'])
        newaddy = self.api.createRandomAddress(the_jason['nickname'])
        bitty = BitKey.objects.create(name=the_jason["nickname"], key=newaddy, user=user)
        return JsonResponse( { 'id' : newaddy } )

class DeleteId( View ):
    api = API()

    def post( self, request ):
        address = request.body.decode('utf-8')
        return JsonResponse( { 'id' : self.api.deleteAddress(address) } )


class CreateChan( View ):
    api = API()

    def post( self, request ):
        passphrase = request.body.decode('utf-8')
        return JsonResponse( { 'chan_address' : self.api.createChan(passphrase) } )


class JoinChan( View ):
    api = API()

    def post( self, request ):
        passphrase = request.body.decode('utf-8')['passphrase']
        address = request.body.decode('utf-8')['address']
        return JsonResponse( { 'join_status' : self.api.joinChan(passphrase, address) } )

class LeaveChan( View ):
    api = API()

    def post( self, request ):
        address = request.body.decode('utf-8')
        return JsonResponse( { 'leave_status' : self.api.leaveChan(address) } )
    
# send an email
class Send ( View ):
    api = API()

    def post( self, request ):
        to_address = request.body.decode('utf-8')['to_address']
        from_address = request.body.decode('utf-8')['from_address']
        subject = request.body.decode('utf-8')['subject']
        message = request.body.decode('utf-8')['message']
        return JsonResponse( { 'message_status' : self.api.sendMessage( to_address, from_address, subject, message ) } )


# gets a list of all the identities of a user
class AllIdentitiesOfUser( View ):
    api = API()

    def get( self, request ):
        user_id = request.body.decode('utf-8')
        user = User.objects.get(pk=user_id)
        addresses = BitKey.objects.filter(user=user)
        return JsonResponse( { 'addresses' : addresses } )

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