from flasktodolist import app, db, bcrypt
from flask import render_template, url_for, redirect, flash, request
from flasktodolist.forms import RegistrationForm, LoginForm, TodolistForm, UpdateForm
from flasktodolist.models import User, Todo
from flask_login import login_user, current_user, logout_user, login_required


@app.route('/')
@app.route('/home')
def home():
    return render_template('index.html', title="Home")


@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash('Account created for {}. You are now able to log in'.format(form.username.data), 'success')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user)
            return redirect(url_for('todolist'))
        else:
            flash('Login was unsuccessful. Please check your credentials and try again', 'danger')
    return render_template('login.html', title='Login', form=form)


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home'))


@app.route('/todolist', methods=['GET'])
@login_required
def todolist():
    inbox = []
    wip = []
    done = []
    todo_data = {}
    form = TodolistForm()
    todos = Todo.query.filter_by(id=current_user.id)
    for todo in todos:
        if todo.column == 1:
            todo_data = {}
            todo_data["todo_id"] = todo.todo_id
            todo_data["title"] = todo.title
            todo_data["column"] = todo.column
            todo_data["id"] = current_user.id
            inbox.append(todo_data)
        elif todo.column == 2:
            todo_data = {}
            todo_data["todo_id"] = todo.todo_id
            todo_data["title"] = todo.title
            todo_data["column"] = todo.column
            todo_data["id"] = current_user.id
            wip.append(todo_data)
        elif todo.column == 3:
            todo_data = {}
            todo_data["todo_id"] = todo.todo_id
            todo_data["title"] = todo.title
            todo_data["column"] = todo.column
            todo_data["id"] = current_user.id
            done.append(todo_data)

    return render_template('todolist.html', title='Todolist', form=form, inbox=inbox, wip=wip, done=done)


@app.route('/add_todo', methods=['POST'])
@login_required
def add_todo():
    form = TodolistForm()
    if form.validate_on_submit():
        todo = Todo(title=form.title.data, id=current_user.id)
        db.session.add(todo)
        db.session.commit()
    return redirect(url_for('todolist'))


@app.route('/delete<int:todo_id>', methods=['POST'])
@login_required
def delete(todo_id):
    todo = Todo.query.get_or_404(todo_id)
    db.session.delete(todo)
    db.session.commit()
    return redirect(url_for('todolist'))


@app.route('/update<int:todo_id>', methods=['GET', 'POST'])
@login_required
def update(todo_id):
    todo = Todo.query.get_or_404(todo_id)
    form = UpdateForm()
    if form.validate_on_submit():
        todo.title = form.title.data
        db.session.commit()
        flash('Your task has been updated!', 'success')
        return redirect(url_for('todolist'))
    elif request.method == 'GET':
        form.title.data == todo.title
    return render_template('update.html', form=form, title='Update Post')
