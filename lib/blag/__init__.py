from flask import Flask
import sqlite3

db = sqlite3.connect('blog.db')
db_cursor = db.cursor()
db_cursor.execute("""CREATE TABLE IF NOT EXISTS Posts (
    eid INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    post TEXT NOT NULL
)""")
db_cursor.execute("""CREATE TABLE IF NOT EXISTS About (
    name TEXT NOT NULL,
    desc TEXT NOT NULL
)""")
db.commit()


app = Flask(__name__)
config = {}


def add_route(route, methods=['GET']):
    print(route, repr(methods))
    return app.route(route, methods=methods)
