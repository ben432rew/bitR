from django.contrib.auth import authenticate, login, logout
from django.core import serializers
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect
from bmapi.forms import UserCreateForm
from django.views.generic import View
from django.http import JsonResponse
from bmapi.wrapper import BMclient
from bitweb.models import User
from bmapi.models import *

from pprint import pprint
from datetime import datetime, timedelta
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
        to_address = request.json['to_address']
        from_add = request.json['from_address']
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
    return JsonResponse( { 'messages': data, 'chans':chans } )


class getInboxMessagesByUser( View ):
    def post( self, request ):
        chan_addresses = request.json['chans']
        return get_messages( 'getInboxMessagesByToAddress', request, chan_addresses)


class getSentMessageByUser( View ):
    def post( self, request ):
        return get_messages( 'getSentMessagesBySender', request)        


class JoinChan( View ):
    def post( self, request ):
        client_response = BMclient.call( 'joinChan', BMclient._encode( request.json['label'] ), request.json['address'] )
        if client_response['status'] == 200 or client_response['status'] == 16:
            return JsonResponse( { 'label' : request.json['label'], 'address': request.json['address'] } )
        else:
            return JsonResponse( { 'status': client_response['status'], 'error':client_response['data'] })


class CreateChan( View ):
    def post( self, request ):
        client_response = BMclient.call('createChan', BMclient._encode(request.json['form']))
        if client_response['status'] == 24:
            pass
            # here we have to deal with multiple users trying to create a chan
            # with the same name
        elif client_response['status'] != 200:
            return JsonResponse( { 'error' : client_response['status'] } )
        else:
            address = client_response['data'][0]['address']
            return JsonResponse( { 'address' : address, 'label' : request.json['form'] } )


class LeaveChan( View ):
    def post( self, request ):
        address = request.json['chan_remove_list']
        status = BMclient.call( 'leaveChan', address )
        return JsonResponse({ 'status' : status })


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
