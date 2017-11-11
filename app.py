from flask import Flask, render_template, url_for, redirect, request, jsonify, g, session
from hashlib import sha256
from functools import wraps
import re
import os
import sqlite3
from datetime import timedelta

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_KEY')

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not 'is_logged_in' in session:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

@app.before_request
def before_request():
    g.db = sqlite3.connect('db.sqlite3')
    # Uncomment below for dictionary cursor results. :)
    # g.db.row_factory = sqlite3.Row
#gkino edited to fix session timeout
    session.permanent = True
    app.permanent_session_lifetime = timedelta(minutes=60)
    session.modified = True

@app.route('/motivation', methods=['GET'])
def motivation():
    return '<center><iframe width="560" height="315" src="https://www.youtube.com/embed/3ugZUq9nm4Y" frameborder="0" allowfullscreen></iframe></center>'

@app.route('/', methods=['GET'])
def index():
    if 'is_logged_in' in session:
        return render_template('todolist.html')
    else:
        return render_template('login.html')

def validate_register_form():
    if len(request.form["username"]) < 3:
        return {"success": False, "reason": "username must be at least 3 characters"}
    elif len(request.form["password"]) < 8:
        return {"success": False, "reason": "Password must be at least 8 characters"}
    elif request.form['password'] != request.form['passwordrepeat']:
        return {"success": False, "reason": "Passwords do not match"}
    elif len(request.form["name"]) < 3:
        return {"success": False, "reason": "Name must be at least 3 characters"}
    elif not re.match(r"[^@]+@[^@]+\.[^@]+", request.form['email']):
        return {"success": False, "reason": "Not valid email"}
    else:
        return {"success": True}

def is_not_duplicate_info():

    lst = [request.form["username"], request.form["email"]]
    cursor = g.db.execute('SELECT username, email FROM users WHERE username = ? OR email = ?', lst)
    
    response = cursor.fetchone()
    
    if not response:
        return {"success": True}
    
    if response[0] == request.form["username"]:
        return {"success": False, "reason": "Username is already taken"}
    # elif response[1] == request.form["name"]:
    #     return {"success": False, "reason": "Name is already taken"}
    elif response[2] == request.form["email"]:
        return {"success": False, "reason": "Email is already taken"}
    else:
        return {"success": False, "reason": "Unknown error occured"}

def insert_new_user():
    user_data = {
        "username": request.form['username'],
        "password": sha256(request.form['password'].encode()).hexdigest(),
        "name": request.form['name'],
        "email": request.form['email']
    }
    with g.db as con:
        sql_query = "INSERT INTO users (username, password, name, email) VALUES (:username, :password, :name, :email)"
        cursor = con.execute(sql_query, user_data)
        con.commit()


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        resp = validate_register_form()

        if resp["success"]:
            not_duplicate_info = is_not_duplicate_info()
            if not not_duplicate_info['success']:
                return jsonify(not_duplicate_info)
            insert_new_user()
            return jsonify(resp)
        else:
            return jsonify(resp) 
    else:    
        return render_template('register.html')
        
        
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        given_username = request.form['username'].strip()
        given_password = request.form['password'].strip()
        
        cursor = g.db.execute('SELECT password, name, email FROM users WHERE username = ?', [given_username])
        result = cursor.fetchone()
        if result:
            if result[0] != sha256(given_password.encode()).hexdigest():
                return jsonify({"success": False, "reason": "username or password is incorrect"})
            else:
                session['is_logged_in'] = True
                session['name'] = result[1]
                session['email'] = result[2]
                return jsonify({"success": True})
        else:
            return jsonify({"success": False, "reason": "username or password is incorrect"})
        
        
    elif request.method == 'GET':
        if 'is_logged_in' in session:
            return render_template('todolist.html')
        else:
            return render_template('login.html')



@app.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return redirect(url_for('index'))


@app.route('/todolist', methods=['GET'])
@login_required
def todolist():
    return render_template('todolist.html')
    
@app.route('/changepassword', methods=['GET', 'POST'])
@login_required
def changepassword():
    if request.method == 'POST':
        password = request.form['password'].strip()
        new_password = request.form['newpassword'].strip()
        new_password_repeat = request.form['repeatnewpassword'].strip()
        
        if len(new_password) < 8:
            return jsonify({"success": False, "reason": "Password must be at least 8 characters"})
        elif password == new_password:
            return jsonify({"success": False, "reason": "Your old password and your new password must be different"})
        elif new_password != new_password_repeat:
            return jsonify({"success": False, "reason": "New password does not match"})
        
        cursor = g.db.execute('SELECT password FROM users WHERE email = (?)', [session['email']])
        row = cursor.fetchone()
        if not row:
            return jsonify({"success": False, "reason": "This user does not exist"})
        if row[0] != sha256(password.encode()).hexdigest():
            return jsonify({"success": False, "reason": "Current password does not match"})
        
        new_password = sha256(new_password.encode()).hexdigest()
        cursor = g.db.execute('UPDATE users SET password = (?) WHERE email = (?)', [new_password, session['email']])
        g.db.commit()
        if cursor.rowcount != 1:
            return jsonify({"success": False, "reason": "An unknown error occured"})
        else:
            return jsonify({"success": True})
    else:
        return render_template('changepassword.html')
    
    
@app.route('/add_task', methods=['GET', 'POST'])
@login_required
def add_task():
    return render_template('add_task.html')
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
