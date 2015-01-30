from django.views.generic import View
from django.http import JsonResponse
from django.shortcuts import render
from bmapi.wrapperAPI import API


class AllMessages( View ):
    def get(self, request):
        api = API()
        return JsonResponse ( {'messages': api.getAllMessages()} )


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