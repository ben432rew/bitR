from xmlrpc import client as Client
import base64
import json
import time
from pprint import pprint
from django.conf import settings


class API():
	def __init__(self):
		''' connect to API and get list of available API calls'''

		url = "{protocol}{user}:{password}@{host}:{port}/".format(
			protocol=settings.BMAPI["protocol"],
			user=settings.BMAPI["user"],
			password=settings.BMAPI["password"],
			host=settings.BMAPI["host"],
			port=settings.BMAPI["port"]
		)
		self.api = Client.ServerProxy( url )

		# self.apiDir = []
		# for m in json.loads( self.api.call( 'help' ) )['data']:
		# 	setattr( self, method, )
		# 	self.apiDir.append( m['method'] )

	def _decode( self, StuffTobeDecode ):
		return base64.b64decode( StuffTobeDecode ).decode()
	
	def _encode(self, StuffTObeEncode):
		return base64.b64encode(bytes(StuffTObeEncode, "utf-8")).decode()

	def call( self, method, *args ):
		# if method not in self.apiDir: return False

		call = 'self.api.{}{}'.format( method, str( args ) )
		response = eval( call, { 'self': self } )
		response = json.loads( response )
		if not isinstance( response['data'], list ):
			response['data'] = [ response['data'] ]
		return self.clean(response)

	def clean( self, response):
		check = ['message','subject','label','ripe']
		for dic in response['data']:
			for key,value in dic.items():
				if key in check:
					dic[str(key)] = self._decode( value )

		return response

	# def sendMessage(self,subject,message,toAddress,fromAddress):
	# 	subject = base64.b64encode(bytes(subject, "utf-8")).decode()
	# 	message = base64.b64encode(bytes(message, "utf-8")).decode()
	# 	ackData = self.api.sendMessage(toAddress, fromAddress, subject,message)
	# 	return ackData
	# 	# print ('The ackData is:', ackData)
	# 	# while True:
	# 	# 	time.sleep(2)
	# 	# print ('Current status:', self.api.getStatus(ackData))

BMclient = API()
