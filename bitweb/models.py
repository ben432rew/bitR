from django.db import models
from django.contrib.auth.models import AbstractUser

class User( AbstractUser ):
	pass

class Token( models.Model ):
	user = models.ForeignKey( User )
	token = models.CharField( max_length = 50 )

	def check(self, token_try):
		if token_try == self.token:
			return True
		else:
			return False