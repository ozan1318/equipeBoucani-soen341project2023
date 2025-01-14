#TODO from flask_wtf import FlaskForm
#TODO from wtforms import ...
#todo from wtfforms.validators import ... , and also import regex

from functools import wraps
from flask import g, request, redirect, url_for
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if g.user is None:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function