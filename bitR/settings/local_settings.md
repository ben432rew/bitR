# local_settings.py

```python
SECRET_KEY = 'dsopj*&*d*dfs7S&77^6A&769E%$&&*d58HOIOdffffcIBIUt='```

DATABASES = { 'default': {
   'ENGINE': 'django.db.backends.postgresql_psycopg2',
   'NAME': 'bdname',
   'USER': 'userName',
   'PASSWORD': 'password',
   'HOST': '127.0.0.1',
   'PORT': '5432',
} }

# Bitmessage API info

BMAPI = {
	'protocol': 'http://',
	'host': '127.0.0.1',
	'port': 8442,
	'user': 'userName',
	'password': 'password'
}
'''
