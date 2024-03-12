#!/usr/bin/env python3
"""The following module is a Flask application that emulates user login
functionality, allowing users to log in as different mock users via URL
parameters and displaying personalized welcome messages based on the logged-in
user's details or a default message if no user is logged in"""
from flask import Flask, render_template, request, g
from flask_babel import Babel
import pytz
from datetime import datetime

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
    # Check if the 'locale' parameter is in the URL and its a supported locale
    requested_locale = request.args.get('locale')
    if requested_locale in app.config['LANGUAGES']:
        return requested_locale
    if g.user:
        requested_locale = g.user.get('locale')
        if requested_locale and requested_locale in app.config['LANGUAGES']:
            return requested_locale
    requested_locale = request.headers.get('locale', None)
    if requested_locale in app.config['LANGUAGES']:
        return requested_locale
    # If not or if the parameter is not present, use default behavior
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@babel.timezoneselector
def get_timezone():
    """
    Select the best time zone for the user based on their request.
    """
    # Check if the 'timezone' parameter is in the URL
    requested_timezone = request.args.get('timezone')
    if requested_timezone:
        try:
            pytz.timezone(requested_timezone)
            return requested_timezone
        except pytz.exceptions.UnknownTimeZoneError:
            pass

    # Find time zone from user settings
    if g.user:
        user_timezone = g.user.get('timezone')
        if user_timezone:
            try:
                pytz.timezone(user_timezone)
                return user_timezone
            except pytz.exceptions.UnknownTimeZoneError:
                pass

    # Default to UTC
    return 'UTC'


@app.route("/")
def index():
    """
    Render the index.html template.

    Returns:
        str: Rendered HTML content.
    """
    # Get the user's time zone
    user_timezone = pytz.timezone(get_timezone())

    # Get the current time in the user's time zone
    current_time = datetime.now(user_timezone).strftime(
            "%b %d, %Y, %I:%M:%S %p"
            )

    # Render the template with the current time
    return render_template("index.html", current_time=current_time)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000", debug=True)
