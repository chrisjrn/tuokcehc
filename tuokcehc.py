from flask import Flask
from flask import render_template
from flask import request
from flask import url_for


app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/form', methods=['POST',])
def form():

    pubkey = request.form["pubkey"]

    template_data = {
        "epirts_publishable_key": pubkey,
    }

    return render_template('form.html', **template_data)
