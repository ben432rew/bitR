from django.test import TestCase,Client
from bmapi.wrapper import API
from pprint import pprint
import base64
import string
import random
import json

# Create your tests here.
class WrapperTest(TestCase):
	def setUp(self):
		self.bmclient = API()

	def test_bmclient_instance(self):
		self.assertIsInstance(self.bmclient,API)

	def test_call(self):
		fake_method = ''.join(random.choice(string.ascii_uppercase) for i in range(12))
		repson = self.bmclient.call(fake_method)
		self.assertEqual(repson['status'], 404)

	def test_encode(self):
		string = "Random String"
		encode = self.bmclient._encode(string)
		self.assertIsNot(string, encode)

	def test_decode(self):
		string = "Random string"
		encoded = base64.b64encode( bytes(string, "utf-8") ).decode()
		decoded = self.bmclient._decode( encoded )
		self.assertEqual(string, decoded)

	def test_call_getAllInboxMessages_reponse(self):
		repson = self.bmclient.call("getAllInboxMessages")
		self.assertIsInstance(repson,dict)
		# status code should be 200 if method is found
		self.assertEqual(repson['status'], 200)

	def test_call_getAllInboxMessages_reponse_string(self):
		repson = self.bmclient.call("getAllInboxMessages")
		self.assertNotIsInstance(repson,str)

	def test_call_getAllInboxMessageIDs(self):
		repson = self.bmclient.call("getAllInboxMessageIDs")
		self.assertIsInstance(repson,dict)
		self.assertEqual(repson['status'], 200)
	
	def test_call_getAllSentMessages(self):
		repson = self.bmclient.call("getAllSentMessages")
		self.assertIsInstance(repson,dict)
		self.assertEqual(repson['status'], 200)
	
	def test_call_clientStatus(self):
		repson = self.bmclient.call("clientStatus")
		self.assertEqual(repson['status'], 200)
	
	# "toaddress and fromaddress should be replace with address that are valid and are in your keys.dat"
	# def test_call_sendMessage(self):
	# 	toaddress = "BM-2cUsUouTXohE15YA9sJzhghLCndnnxz2Ad"
	# 	fromaddress = "BM-2cWURDso3XTuCACUSUC17QFcf8488DcjUY"
	# 	sub = base64.b64encode( bytes("Test 123", "utf-8") ).decode()
	# 	mes = base64.b64encode( bytes("Test 123", "utf-8") ).decode()
	# 	repson = self.bmclient.call("sendMessage",toaddress,fromaddress,sub,mes)
	# 	self.assertEqual(repson['status'], 200) 

class TestViewDjango(TestCase):
	def setUp(self):
		self.client = Client()

	def test_rootrequests(self):
		resp = self.client.get('/')
		self.assertEqual(resp.status_code, 200) 
	
	def test_signup(self):
		info = json.dumps({'username': 'a', 'password1': 'a','password2':'a'})
		response = self.client.post('/bmapi/signup', content_type='application/json', data=info)
		pprint(response.request)
		pprint(response.content)
		self.assertEqual(response.status_code, 200)
	
	# def test_logout(self):
	# 	response = self.client.post("/bmapi/logout")
	# 	self.assertEqual(response.status_code, 302)

	# def test_login(self):		
	# 	info = json.dumps({'username': 'a', 'password': 'a'})
	# 	response = self.client.post('/bmapi/login', content_type='application/json', data=info)
	# 	self.assertEqual(response.status_code, 200)
	
	# def test_createId(self):
	# 	info = json.dumps({'identity':'wtf'})
	# 	response = self.client.post('/bmapi/create_id',content_type='application/json', data=info)
	# 	# self.assertEqual(response.status_code, 202)