from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect
from bmapi.forms import UserCreateForm
from bmapi.models import Token, BitKey
from django.views.generic import View
from django.http import JsonResponse
from bmapi.wrapper import client as BMclient
from bitweb.models import User
from datetime import datetime
from pprint import pprint
import uuid
import json


# check if the token is in the database and if it's expired (older than 5 hours)
# maybe include request and have it decode and load the json and return also
def check_token (token):
    if Token.objects.filter(token=token).exists():
        if Token.objects.get(token=token).created_at > datetime.now() - datetime.timedelta(hours=5):
            return Token.objects.get(token=token).user
        else:
            return "expired"
    return "token does not exist in database"


# dry these next two functions out
class Signup( View ):
    def post(self, request):
        the_jason = json.loads(request.body.decode('utf-8'))
        form = UserCreateForm( the_jason )
        if form.is_valid():
            form.save()
            user = authenticate(username = the_jason["username"], password=the_jason["password1"])
            login(request, user)
            token = Token.objects.create(token = uuid.uuid4(), user = user)
            string_ver = str(token.token) 
            return JsonResponse({ 'token':string_ver})
        return JsonResponse({})


class Login( View ):
    def post(self, request):
        the_jason = json.loads(request.body.decode('utf-8'))
        user = authenticate(username=the_jason["username"], password=the_jason["password"])
        if user:
            login(request, user)
            token = Token.objects.create(token = uuid.uuid4(), user = user)
            string_ver = str(token.token) 
            return JsonResponse({ 'token':string_ver})
        return JsonResponse({})


class Logout( View ):
    def get( self, request ):
        request.user.token_set.all().delete()
        logout( request )
        return redirect ( '/' )


#getting all messages from client, not really usefull, only for testing
class AllMessages( View ):
    def get(self, request):
        BMclient.call('getAllInboxMessages')
        return JsonResponse ( {'messages': BMclient.call('getAllInboxMessages')} )


# this probably should be in the wrapper, but for now it's here.  This will: 
# be given a list of currently logged in identities.  It will check for new
# messages for those identities by checking the receivedTime against one minute
# ago, and if there are any messages since the last minute, sends them to the 
# user's browsers inbox
class EveryMinute( View ):
    pass


class CreateId( View ):
    
    def post( self, request ):
        the_jason = json.loads(request.body.decode('utf-8'))
        t1 = uuid.UUID(the_jason['token'])
        try:
            token = Token.objects.get(token=t1)
        except:
            return JsonResponse( {'addresses': 'invalid token given'})
        newaddy = BMclient.call('createRandomAddress', the_jason['nickname'])
        pprint(newaddy)
        bitty = BitKey.objects.create(name=the_jason["nickname"], key=newaddy, user=token.user)
        return JsonResponse( { 'id' : newaddy } )

# class DeleteId( View ):

#     def post( self, request ):
#         the_jason = json.loads(request.body.decode('utf-8'))
#         address = the_json['address']
#         return JsonResponse( { 'id' : self.api.deleteAddress(address) } )


# class CreateChan( View ):

#     def post( self, request ):
#         the_jason = json.loads(request.body.decode('utf-8'))
#         passphrase = the_json['passphrase']
#         return JsonResponse( { 'chan_address' : self.api.createChan(passphrase) } )


# class JoinChan( View ):

#     def post( self, request ):
#         the_jason = json.loads(request.body.decode('utf-8'))
#         passphrase = the_json['passphrase']
#         address = the_json['address']
#         return JsonResponse( { 'join_status' : self.api.joinChan(passphrase, address) } )

# class LeaveChan( View ):

#     def post( self, request ):
#         the_jason = json.loads(request.body.decode('utf-8'))
#         address = the_json['address']
#         return JsonResponse( { 'leave_status' : self.api.leaveChan(address) } )
    
# # send an email
# class Send ( View ):

#     def post( self, request ):
#         the_jason = json.loads(request.body.decode('utf-8'))
#         to_address = the_json['to_address']
#         from_address = the_json['from_address']
#         subject = the_json['subject']
#         message = the_json['message']
#         return JsonResponse( { 'message_status' : self.api.sendMessage( to_address, from_address, subject, message ) } )


# gets a list of all the identities of a user
class AllIdentitiesOfUser( View ):

    def post( self, request ):
        the_jason = json.loads(request.body.decode('utf-8'))
        t1 = uuid.UUID(the_jason['token'])
        try:
            token = Token.objects.get(token=t1)
        except:
            return JsonResponse( {'addresses': 'invalid token given'})
        bitkeys = BitKey.objects.filter(user=token.user)
        if bitkeys.count() > 0:
            addresses = [{'identity':bk.name} for bk in bitkeys]
            return JsonResponse( { 'addresses' : addresses } )
        return JsonResponse( {'addresses': 'none'})


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