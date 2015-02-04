from django.http import JsonResponse
from django.conf import settings
from bitweb.models import User
from bmapi.models import Token, BitKey
from datetime import datetime, timedelta
import json
import uuid

class tokenAuth( object ):
    def process_request( self, request ):
        # from pprint import pprint as p
        # p( request )
        path = request.path.split('/')
        if path[1] != 'bmapi':
            return None

        if path[2] not in settings.SKIP_TOKEN_CHECK:
            request.json = json.loads( request.body.decode('utf-8') )
            token = uuid.UUID( request.json['token'] )

            if Token.objects.filter(token=token).exists():
                token = Token.objects.get( token=token )
                if token.created_at.toordinal() > ( datetime.now() - timedelta(days=1) ).toordinal():
                    request.json['_user'] = token.user
                else:
                    return JsonResponse( {}, status=401, content_type='application/json' )
