## Setup

`git clone https://github.com/himleyb85/bitR`

`cd bitR`

`virutalenv venv`

`source venv/bin/activate`

`pip3 install -r requirements.txt`

`createdb bitr`

`sudo su postgres`

You should now be at the postgres user bash prompt

`psql`

You should now be in the psql prompt -> postgres=#

`CREATE ROLE bears WITH login password 'bears';`

`ALTER ROLE bears WITH superuser createdb createrole;`

`\q`

`exit`

Put the app secret key and the databases information in a file named "local_settings" in your settings folder

create a file named api_info.py in app bmapi with this dictionary:

`API_LOGIN = { "user": <username>, "password": <password> }`

To enable the API, copy and paste these lines into the bitmessagesettings section of the keys.dat file. Note that the values <username> and <password> below are merely examples, and should be replaced by values that cannot feasibly be guessed:

`apienabled = true
apiport = 8442
apiinterface = 127.0.0.1
apiusername = <username> 
apipassword = <password>
`

Should be good to go.  To start server,

`python3 manage.py runserver`

then direct your browser to http://127.0.0.1:8000
