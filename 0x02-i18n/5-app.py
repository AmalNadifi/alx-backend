#!/usr/bin/env python3
"""The following module is a Flask application that emulates user login
functionality, allowing users to log in as different mock users via URL
parameters and displaying personalized welcome messages based on the logged-in
user's details or a default message if no user is logged in"""
from flask import Flask, render_template, request, g
from flask_babel import Babel


users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


class Config(object):
    """Config class for setting up available languages
    and default locale/timezone"""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


def get_user(user_id):
    """
    Get user details based on user ID
    """
    u_id = request.args.get('login_as', None)
    if u_id is not None and int(u_id) in users.keys():
        return users.get(int(u_id))
    return None


@app.before_request
def before_request():
    """
    Set the current user before each request
    """
    user_id = request.args.get('login_as')
    g.user = get_user(user_id)


@babel.localeselector
def get_locale():
    """
    Select the best language for the user based on their request.
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route("/")
def index():
    """
    Render the index.html template.

    Returns:
        str: Rendered HTML content.
    """
    return render_template("5-index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000", debug=True)
