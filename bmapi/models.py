from bitweb.models import User
from django.db import models


# is_passive field is for the when the passive operating mode ability is built 
# into bitmessage.  See chapter 7:  https://bitmessage.org/bitmessage.pdf
class BitKey(models.Model):
    key = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey( User )
    is_passive = models.BooleanField(default=False)