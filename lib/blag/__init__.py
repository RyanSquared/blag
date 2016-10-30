from flask import Flask
from tinydb import TinyDB

app = Flask(__name__)
db = TinyDB('posts.json')
config = {}
