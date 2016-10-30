from flask import Flask
from tinydb import TinyDB


app = Flask(__name__)
db = TinyDB('posts.json')
config = {}


def add_route(route, methods):
    print(route, repr(methods))
    return app.route(route, methods=methods)
