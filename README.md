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

Should be good to go.  To start server,

`python3 manage.py runserver`

then direct your browser to http://127.0.0.1:8000