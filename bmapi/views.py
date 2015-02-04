from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect
from datetime import datetime, timedelta
from bmapi.forms import UserCreateForm
from bmapi.models import Token, BitKey
from django.views.generic import View
from django.http import JsonResponse
from bmapi.wrapper import BMclient
from bitweb.models import User
from pprint import pprint
import uuid
import json


def check_token_load_json (request):
    the_jason = json.loads(request.body.decode('utf-8'))
    token = uuid.UUID(the_jason['token'])
    if Token.objects.filter(token=token).exists():
        if Token.objects.get(token=token).created_at.toordinal() > (datetime.now() - timedelta(days=1)).toordinal():
            return { 'user':Token.objects.get(token=token).user, 'json':the_jason}
        else:
            return { 'error':" token expired", 'json':False}
    return { 'error':"token does not exist in database", 'json':False}


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


# this probably should be in the wrapper, but for now it's here.  This will: 
# be given a list of currently logged in identities.  It will check for new
# messages for those identities by checking the receivedTime against one minute
# ago, and if there are any messages since the last minute, sends them to the 
# user's browsers inbox
class EveryMinute( View ):
    pass


class CreateId( View ):
    def post( self, request ):
        checked = check_token_load_json(request)
        if checked['json']:
# need to check for status code so doesn't save to db if client doesn't like it
            newaddy = BMclient.call('createRandomAddress', BMclient._encode(checked['json']['identity']) )
            bitty = BitKey.objects.create(name=checked['json']['identity'], key=newaddy['data'][0]['address'], user=checked['user'])
            return JsonResponse( { 'id' : newaddy['data'][0]['address'] } )
        return JsonResponse ( {'error' : checked['error'] } )


class Send ( View ):
    def post( self, request ):
        checked = check_token_load_json(request)
        if checked['json']:        
            to_address = checked['json']['to_address']
            from_name = checked['json']['from']
            from_add = BitKey.objects.get(name=from_name)
            subject = checked['json']['subject']
            message = checked['json']['message']
            sent = BMclient.call(
                'sendMessage',
                to_address,
                from_add.key,
                BMclient._encode(subject),
                BMclient._encode(message)
            )
            return JsonResponse( { 'message_status' : sent } )
        return JsonResponse( { 'error':checked['error'] } )


class AllIdentitiesOfUser( View ):
    def post( self, request ):
        checked = check_token_load_json(request)
        if checked['json']:
            bitkeys = BitKey.objects.filter(user=checked['user'])
            addresses = [ {'identity':bk.name} for bk in bitkeys ]
            return JsonResponse( { 'addresses' : addresses } )
        return JsonResponse( { 'addresses': checked['error'] } )


def get_messages( function_name, request ):
    checked = check_token_load_json(request)
    if checked['json']:
        bitkeys = BitKey.objects.filter(user=checked['user'])
        addresses = [ bk.key for bk in bitkeys ]
        data = [ BMclient.call( function_name, address ) for address in addresses ]
        return JsonResponse( { 'messages': data } )
    return JsonResponse ( { 'error': checked['error'] } )


class getInboxMessagesByUser( View ):
    def post( self, request ):
        return get_messages( 'getInboxMessagesByToAddress', request)


class getSentMessageByUser( View ):
    def post( self, request ):
        return get_messages( 'getSentMessagesBySender', request)        


#for searching in the current emails a user has
class Search( View ):
    pass


#get all started, use post to star or unstar
class Starred( View ):
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
