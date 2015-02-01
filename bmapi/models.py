from django.contrib.auth.models import User
from django.db import models


class BitKey(models.Model):
    key = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey( User )


class Token( models.Model):
    user = models.ForeignKey( User )
    created_at = models.DateTimeField(auto_now_add=True)
    token = models.CharField( max_length = 50 )