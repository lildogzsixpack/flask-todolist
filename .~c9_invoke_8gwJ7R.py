from flask import Flask, render_template, url_for, redirect, request, jsonify

app = Flask(__name__)

@app.route('/motivation')
def motivation():
    return '<iframe width="560" height="315" src="https://www.youtube.com/embed/3ugZUq9nm4Y" frameborder="0" allowfullscreen></iframe>'

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

def validate_register_form():
    if len(request.form["username"]) < 3:
        return {"success": False, "reason": "username must be at least 3 characters"}
    elif len(request.form["password"]) < 8:
        return {"success": False, "reason": "Password must be at least 8 characters"}
    elif request.form['password'] != request.form['passwordrepeat']:
        return {"success": False, "reason": "Passwords do not match"}
    elif len(request.form["name"]) < 3:
        return {"success": False, "reason": "Name must be at least 3 characters"}
    else:
        return {"success": True}

@app.route('/register', methods=['GET', 'POST'])
        resp['suc']
    if request.method == 'POST':
        resp = validate_register_form()

        if resp["success"]:
            print(request.form['username'])
            print(request.form['password'])
            print(request.form['passwordrepeat'])
            print(request.form['name'])
            print(request.form['email'])
            return jsonify(resp)
        else:
            return jsonify(resp) 
    else:    
        return render_template('register.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)