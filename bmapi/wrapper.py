from xmlrpc import client
import base64
import json
import time
from pprint import pprint
from django.conf import settings


class API():
	def __init__(self):
		''' connect to API and get list of available API calls'''

		url = '127.0.0.1'
		port = 8442
		url = "http://{}:{}@{}:{}/".format( settings.BMAPI["user"], settings.BMAPI["password"], url, port )
		self.api = client.ServerProxy( url )

		# self.apiDir = []
		# for m in json.loads( self.api.call( 'help' ) )['data']:
		# 	self.apiDir.append(m['method'])



	def call( self, method, *args ):
		# if method not in self.apiDir: return False

		call = 'self.api.{}{}'.format( method, str( args ) )
		print( 'call:', call )
		response = eval( call, { 'self': self } )
		response = json.loads( response )
		return self.clean(response)

	# 	# key = list( response.keys() )[0]

	# 	response = response[key]

	# 	for values in response:
	# 		for key, value in values.items():
	# 			print(key, value, type(value), base64.b64decode(value) )
	# 	return response

	def clean( self, response):
		check = ['message','subject','label','ripe']
		for dic in response['data']:
			for key,value in dic.items():
				if key in check:
					dic[str(key)] = base64.b64decode(value).decode()
		return response

	# def getAllMessages(self):
	# 	inboxMessages = self.call("getAllInboxMessages")
	# 	return self.clean(inboxMessages)

	# def getAllIdentities( self ):
	# 	addresses = self.api.listAddresses2()
	# 	return addresses

	# # string is label 
	# def createRandomAddress(self,label):
	# 	x = base64.b64encode(bytes(label, "utf-8")).decode()
	# 	address = self.api.createRandomAddress(x)
	# 	return address

	# def createChan(self, passphrase):
	# 	x = base64.b64encode(bytes(passphrase, "utf-8")).decode()
	# 	chan = self.api.createChan(x)
	# 	return chan

	# def joinChan(self, passphrase, address):
	# 	x = base64.b64encode(bytes(passphrase, "utf-8")).decode()
	# 	join_status = self.api.joinChan(x, address)
	# 	return join_status

	# def leaveChan(self, address):
	# 	leave_status = self.api.leaveChan(address)
	# 	return leave_status

	# def sendMessage(self,subject,message,toAddress,fromAddress):
	# 	subject = base64.b64encode(bytes(subject, "utf-8")).decode()
	# 	message = base64.b64encode(bytes(message, "utf-8")).decode()
	# 	ackData = self.api.sendMessage(toAddress, fromAddress, subject,message)
	# 	return ackData
	# 	# print ('The ackData is:', ackData)
	# 	# while True:
	# 	# 	time.sleep(2)
	# 	# print ('Current status:', self.api.getStatus(ackData))
	


	# def getAllMessagesIds(self):
	# 	ids = self.api.getAllInboxMessageIDs()
	# 	return(json.loads(ids)["inboxMessageIds"])



a = API()

'''
[{'encodingType': 2,
  'fromAddress': 'BM-2cUsUouTXohE15YA9sJzhghLCndnnxz2Ad',
  'message': 'asdasdad',
  'msgid': '2ea1235750e89a38d7751010fce7c62f0a46c292950db2abdf09612ee4bdcf66',
  'read': 1,
  'receivedTime': '1422460069',
  'subject': 'asdasd',
  'toAddress': 'BM-2cUTMYmgrpXmhieJLad7s5tLPnBQKaTyqb'},
 {'encodingType': 2,
  'fromAddress': 'BM-2cVr4jKDZNvBu4GeJvLqybgaaMCLqnv9Rr',
  'message': 'fish fish fish fish fish fish fish',
  'msgid': '30d23bc4174439738734db2e4bd9835308098fef2f31a049aca49840ddc90d90',
  'read': 1,
  'receivedTime': '1422461066',
  'subject': 'fish',
  'toAddress': 'BM-2cUTMYmgrpXmhieJLad7s5tLPnBQKaTyqb'}]
'''

client = API()