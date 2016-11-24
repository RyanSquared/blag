from flask import Flask
import sqlite3
import config as config_module

app = Flask(__name__)
config = {}

for item in dir(config_module):
    if item[0] != "_":
        print("=== Config ===")
        for key in (key for key in dir(config_module) if key[0] != "_"):
            app.config[key] = getattr(config_module, key)
            print(key, "=", getattr(config_module, key))
        print("===+------+===")
        break

app.config['config_module'] = config_module

@app.route("/")
def get_index():
    with open("static/index.html") as index_file:
        return index_file.read()

db = sqlite3.connect('blog.db')
db_cursor = db.cursor()
db_cursor.execute("""CREATE TABLE IF NOT EXISTS Posts (
    eid INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    post TEXT NOT NULL,
    post_source TEXT NOT NULL
)""")
db.commit()

def add_route(route, methods=['GET']):
    print(route, repr(methods))
    return app.route(route, methods=methods)

from . import rest

rest.add_routes(add_route, app)
