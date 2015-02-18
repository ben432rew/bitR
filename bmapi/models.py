from bitweb.models import User
from django.db import models


class BitKey(models.Model):
    name = models.CharField( max_length=200 )
    key = models.CharField( max_length=200 )
    created_at = models.DateTimeField( auto_now_add=True )
    user = models.ForeignKey( User )


class Token( models.Model):
    user = models.ForeignKey( User )
    created_at = models.DateTimeField( auto_now_add=True )
    token = models.CharField( max_length=50, db_index=True )


class Chan_subscriptions( models.Model ):
    user = models.ForeignKey( User )
    label = models.CharField( max_length=200 )
    address = models.CharField( max_length=200 )
