from xmlrpc import client
import base64
import json
import time
from pprint import pprint as print
from api_info import API_LOGIN


class API():
	def __init__(self):
		url = '127.0.0.1'
		port = 8442
		url = "http://{}:{}@{}:{}/".format( API_LOGIN["user"], API_LOGIN["password"], url,port)
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


	def getAllMessagesIds(self):
		ids = self.api.getAllInboxMessageIDs()
<<<<<<< HEAD:bitrest/wrapperAPI.py
<<<<<<< Updated upstream:bitrest/wrapperAPI.py
		return(json.loads(ids)["inboxMessageIds"])
=======
=======
>>>>>>> e90a05d48748fd891a0b5cfb3ba6a550627a1bf6:bmapi/wrapperAPI.py
		return(json.loads(ids)["inboxMessageIds"])


if __name__ == "__main__":
	a = API()
	print(a.getAllMessages())

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
<<<<<<< HEAD:bitrest/wrapperAPI.py
>>>>>>> Stashed changes:bmapi/wrapperAPI.py
=======
>>>>>>> e90a05d48748fd891a0b5cfb3ba6a550627a1bf6:bmapi/wrapperAPI.py
