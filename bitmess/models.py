from django.contrib.auth.models import User
from django.db import models


class BitKey(models.Model):
    key = models.CharField(max_length=200)
    created_at = models.CharField(auto_now_add=True)
    user = models.ForeignKey( User )
    is_passive = models.BooleanField(default=False)


class ReadMessage(models.Model):
    key = models.CharField(max_length=200, primary_key=True)