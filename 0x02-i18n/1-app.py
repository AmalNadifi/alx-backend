#!/usr/bin/env python3
""" The following module is a basic flask app with Babel object"""
from flask import Flask, render_template
from flask_babel import Babel

app = Flask(__name__)

# Config class for setting up available languages and default locale/timezone


class Config:
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"

# Instantiate Babel object


babel = Babel(app)


@app.route('/')
def index():
    """
    Render the index.html template.

    Returns:
        str: Rendered HTML content.
    """
    return render_template('1-index.html')


if __name__ == '__main__':
    app.config.from_object(Config)
    app.run(port="5000", host="0.0.0.0", debug=True)
