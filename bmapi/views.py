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
import time


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
    def post(self, request ):
        logout( request )
        the_jason = json.loads(request.body.decode("utf-8"))
        if the_jason.get("token",False):
            Token.objects.get(token=the_jason['token']).delete()
        return JsonResponse({'status':'logged out'})


class CreateId( View ):
    def post( self, request ):
        if request.json['identity'] in BitKey.objects.filter(user=request.json['_user']):
                return JsonResponse( { 'error' : 'You have already created an identity with that name'})
        newaddy = BMclient.call('createRandomAddress', BMclient._encode(request.json['identity']) )
        bitty = BitKey.objects.create(name=request.json['identity'], key=newaddy['data'][0]['address'], user=request.json['_user'])
        return JsonResponse( { 'identity' : bitty.name } )


class Send ( View ):
    def post( self, request ):
        from_name = request.json['from_address']
        if request.json['to_address'] == 'chan_post':
            to_address = from_add = Chan_subscriptions.objects.get(label=from_name, user=request.json['_user']).address
        elif 'reply' in request.json:
            to_address = request.json['to_address']
            from_add = request.json['from_address']
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
        addresses = [ {'identity':bk.name, 'key':bk.key} for bk in bitkeys ]
        return JsonResponse( { 'addresses' : addresses } )


def get_messages( function_name, request, chans=False ):
    bitkeys = BitKey.objects.filter(user=request.json['_user'])
    addresses = [ bk.key for bk in bitkeys ]
    if chans:
        addresses += chans
    data = [ BMclient.call( function_name, address ) for address in addresses ]
    newlist = sorted(data[0]['data'], key=lambda k: k['receivedTime']) 
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
        if request.json['address'] in [ subs.address for subs in  Chan_subscriptions.objects.filter(user=request.json['_user']) ]: return JsonResponse( { 'error': 'already subscribed'})
        client_response = BMclient.call( 'joinChan', BMclient._encode( request.json['label'] ), request.json['address'] )
        if client_response['status'] == 200 or client_response['status'] == 16:
            chan = Chan_subscriptions.objects.create( user=request.json['_user'], label=request.json['label'], address=request.json['address'] )
            return JsonResponse( { 'chan_label' : chan.label, 'chan_address': chan.address } )
        else:
            return JsonResponse( { 'status': client_response['status'], 'error':client_response['data'] })


class CreateChan( View ):
    def post( self, request ):
        passphrase = request.json['form']
        chan = BMclient.call('createChan', BMclient._encode(passphrase))
        if chan['status'] != 200:
            return JsonResponse( { 'error' : chan['status'] } )
        address = chan['data'][0]['address']
        chan_obj = Chan_subscriptions.objects.create(label=passphrase, address=address, user=request.json['_user'])
        return JsonResponse( { 'chan_address' : chan_obj.address, 'chan_label' : chan_obj.label } )


class AllChans( View ):
    def post( self, request ):
        chans = [ { 'chan_label' : chan.label, 'chan_address':chan.address } for chan in Chan_subscriptions.objects.filter( user=request.json['_user'] )]
        return JsonResponse( {'chans':chans} )

class LeaveChan( View ):
    def post( self, request ):
        label = request.json['label']
        chan = Chan_subscriptions.objects.filter(user=request.json['_user'], label = request.json['label'])
        if chan:
            address = chan[0].address
            status = BMclient.call( 'leaveChan', address )
            chan[0].delete()
        else:
            status = 'no chan'
        return JsonResponse({ 'label' : label, 'status' : status })


class DeleteInboxMessage( View ):
    def post( self, request ):
        BMclient.api.trashInboxMessage( request.json['msgid']  )
        return JsonResponse( {} )


class DeleteSentMessage( View ):
    def post( self, request ):
        BMclient.api.trashSentMessage( request.json['msgid']  )
        return JsonResponse( {} )


class getInboxMessageByID( View ):
    def post( self, request ):
        res = BMclient.api.getInboxMessageByID( request.json['msgid'], request.json['read'] )
        return JsonResponse( {} )
