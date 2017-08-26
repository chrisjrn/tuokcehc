import json
import os

from flask import Flask
from flask import render_template
from flask import request
from flask import redirect
from flask import url_for


app = Flask(__name__)


@app.route('/tuokcehc.js')
def client_js():

    template_data = {
    }
    return render_template('tuokcehc.js', **template_data)


@app.route('/form', methods=['POST',])
def form():

    pubkey = request.form["pubkey"]

    VALID_PUBKEYS = set(json.loads(os.environ.get("VALID_PUBKEYS", "[]")))

    if pubkey not in VALID_PUBKEYS:
        raise ValueError("The supplied Stripe publishable key is not in this site's VALID_PUBKEYS")

    template_data = {
        "epirts_publishable_key": pubkey,
    }

    return render_template('form.html', **template_data)
