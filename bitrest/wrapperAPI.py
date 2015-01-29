from xmlrpc import client
import json
import time
import base64
from pprint import pprint as print


class API():
	def __init__( self):
		user = 'bear'
		password = 'bear'
		url = '127.0.0.1'
		port = 8442
		url = "http://{}:{}@{}:{}/".format( user, password, url,port)
		self.api = client.ServerProxy( url )

	def clean( self ):
		pass

	def call( self, method ):
		response = getattr( self.api, method )()
		response = json.loads( response )
		key = list( response.keys() )[0]

		response = response[key]

		for values in response:
			for key, value in values.items():
				print(key, value, type(value), base64.b64decode(value) )
		return response

	# string is label 
	def createRandomAddress(self,label):
		# dont judge me by the code i write
		x = base64.b64encode(bytes(label, "utf-8")).decode()
		address = self.api.createRandomAddress(x)
		return address