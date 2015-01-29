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

	def sendMessage(self,Subject,Message,toAddress,froAddress):
		subject = base64.b64encode(bytes(Subject, "utf-8")).decode()
		message = base64.b64encode(bytes(Message, "utf-8")).decode()
		ackData = self.api.sendMessage(toAddress, froAddress, subject,message)
		# print ('The ackData is:', ackData)
		# while True:
		# 	time.sleep(2)
		# print ('Current status:', self.api.getStatus(ackData))
	
	def getAllMessages(self):
		inboxMessages = json.loads(self.api.getAllInboxMessages())
		for dic in inboxMessages['inboxMessages']:
			for key,value in dic.items():
				if key == 'message':
					dic['message'] = base64.b64decode(value).decode()
				elif key == 'subject':
					dic['subject'] = base64.b64decode(value).decode()
		return(inboxMessages['inboxMessages'])

	def getAllMessagesIds(self,*args):
		if len(args)>0:
			ids = self.api.getAllInboxMessageIDs(args[0].lower())
		else:	
			ids = self.api.getAllInboxMessageIDs()
		return(json.loads(ids)["inboxMessageIds"])