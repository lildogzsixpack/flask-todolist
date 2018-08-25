# Flask-Todolist
A python task organiser. You can add,delete and update your tasks and use the drag and drop feature to keep track of your task progress.
You can find a demo [here](http://35.189.73.150/home) and use the tester credentials:

>email: tester@gmail.com

>password: tester

## Requirements:
- Flask 1.0.2
- Flask-Bcrypt 0.7.1
- Flask-Login 0.4.1
- Flask-SQLAlchemy 2.3.2
- Flask-WTF 0.14.2
# Python version support:
- 3.4+
# Usage:
On a new virtual environment, install the required packages:
```shell
$ git clone https://github.com/lildogzsixpack/flask-todolist.git
$ cd flask-todolist
$ pip install -r requirements.txt
```

Then, export a Flask secret key:
```shell
$ export SECRET_KEY="your_secret_key"
```
And run it:
```shell
$ python run.py
```
# License:
MIT
