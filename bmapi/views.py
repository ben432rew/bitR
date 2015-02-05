from django.contrib.auth import authenticate, login, logout
from django.core import serializers
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect
from datetime import datetime, timedelta
from bmapi.forms import UserCreateForm
from django.views.generic import View
from django.http import JsonResponse
from bmapi.wrapper import BMclient
from bitweb.models import User
from bmapi.models import *
from pprint import pprint
import uuid
import json

def login_token(request, user):
    login(request, user)
    token = Token.objects.create(token = uuid.uuid4(), user = user)
    return JsonResponse({ 'token':str(token.token)})

class Signup( View ):
    def post(self, request):
        the_jason = json.loads(request.body.decode('utf-8'))
        form = UserCreateForm( the_jason )
        if form.is_valid():
            form.save()
            user = authenticate(username = the_jason["username"], password=the_jason["password1"])
            return login_token(request, user)
        return JsonResponse({})


class Login( View ):
    def post(self, request):
        the_jason = json.loads(request.body.decode('utf-8'))
        user = authenticate( username=the_jason["username"], password=the_jason["password"] )
        if user:
            return login_token(request, user)
        return JsonResponse({})


class Logout( View ):
    def get( self, request ):
        request.user.token_set.all().delete()
        logout( request )
        return redirect ( '/' )



class CreateChan( View ):

    def post( self, request ):
        passphrase = request.json['form']
        chan = BMclient.call('createChan', BMclient._encode(passphrase))
        if chan['status'] != 200:
            return JsonResponse( { 'error' : chan['status'] } )
        address = chan['data'][0]['address']
        chan_obj = Chan_subscriptions.objects.create(label=passphrase, address=address, user=request.json['_user'])
        return JsonResponse( { 'chan_address' : chan_obj.address, 'chan_label' : chan_obj.label } )



class CreateId( View ):
    def post( self, request ):
        if request.json['identity'] in BitKey.objects.filter(user=request.json['_user']):
                return JsonResponse( { 'error' : 'You have already created an identity with that name'})
        newaddy = BMclient.call('createRandomAddress', BMclient._encode(request.json['identity']) )
        bitty = BitKey.objects.create(name=request.json['identity'], key=newaddy['data'][0]['address'], user=request.json['_user'])
        return JsonResponse( { 'identity' : bitty.name } )


class Send ( View ):
    def post( self, request ):      
        from_name = request.json['from']
        if request.json['to_address'] == 'chan_post':
            to_address = from_add = Chan_subscriptions.objects.get(label=from_name, user=request.json['_user']).address
        else:
            to_address = request.json['to_address'] 
            from_add = BitKey.objects.get(name=from_name, user=request.json['_user']).key
        subject = request.json['subject']
        message = request.json['message']
        sent = BMclient.call(
            'sendMessage',
            to_address,
            from_add,
            BMclient._encode(subject),
            BMclient._encode(message)
        )
        return JsonResponse( { 'message_status' : sent } )


class AllIdentitiesOfUser( View ):
    def post( self, request ):
        bitkeys = BitKey.objects.filter(user=request.json['_user'])
        addresses = [ {'identity':bk.name} for bk in bitkeys ]
        return JsonResponse( { 'addresses' : addresses } )


def get_messages( function_name, request, chans=False ):
    bitkeys = BitKey.objects.filter(user=request.json['_user'])
    addresses = [ bk.key for bk in bitkeys ]
    if chans:
        addresses += chans
    data = [ BMclient.call( function_name, address ) for address in addresses ]
    return JsonResponse( { 'messages': data, 'chans':chans } )


class getInboxMessagesByUser( View ):
    def post( self, request ):
        chans = Chan_subscriptions.objects.filter(user=request.json['_user']).values('address')
        chan_addresses = [ c['address'] for c in chans]
        return get_messages( 'getInboxMessagesByToAddress', request, chan_addresses)


class getSentMessageByUser( View ):
    def post( self, request ):
        return get_messages( 'getSentMessagesBySender', request)        


class JoinChan( View ):
    def post( self, request ):
        chan = Chan_subscriptions.objects.create( user=request.json['_user'], label=request.json['label'], address=request.json['address'] )
        BMclient.call( 'addSubscription', chan.address, chan.label )
        return JsonResponse( { 'chan_label' : chan.label } )


class AllChans( View ):
    def post( self, request ):
        chans = [ { 'chan_label' : chan.label } for chan in Chan_subscriptions.objects.filter( user=request.json['_user'] )]
        return JsonResponse( {'chans':chans} )


class DeleteMessage( View ):
    def post( self, request ):
        print(1111111111)
        print(   BMclient.call( 'trashMessage',  request.json['msgid'] ) )
        print(222222222222)
        return JsonResponse( {} )


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


# class LeaveChan( View ):

#     def post( self, request ):
#         the_jason = json.loads(request.body.decode('utf-8'))
#         address = the_json['address']
#         return JsonResponse( { 'leave_status' : self.api.leaveChan(address) } )
