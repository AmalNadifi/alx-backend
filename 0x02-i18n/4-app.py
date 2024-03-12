#!/usr/bin/env python3
"""The following module is a basic flask app with internationalization (i18n)
support using Flask-Babel."""
from flask import Flask, render_template, request
from flask_babel import Babel


class Config(object):
    """Config class for setting up available languages
    and default locale/timezone"""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale():
    """
    Select the best language for the user based on their request.
    """
    # Check if the 'locale' parameter is in the URL and its a supported locale
    requested_locale = request.args.get('locale')
    if requested_locale in app.config['LANGUAGES']:
        return requested_locale
    # If not or if the parameter is not present, use default behavior
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route("/")
def index():
    """
    Render the index.html template.

    Returns:
        str: Rendered HTML content.
    """
    return render_template("4-index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000", debug=True)
