'''
 Tuokcehc.js -- tuokcehc.py
 Free software replacement for Stripe Checkout based on epirts.js

 @licstart  The following is the entire license notice for the
 Python code in this file.

 Copyright (C) 2017 Christopher Neugebauer

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

 As additional permission under GNU GPL version 3 section 7, you
 may distribute non-source (e.g. minimized or compacted) forms of
 this program without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 @licend  The above is the entire license notice
 for the Python code in this file.
'''

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
