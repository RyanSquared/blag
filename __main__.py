#!/usr/bin/env python3

import config as config_module
import lib.blag as blag

for item in dir(config_module):
    if item[0] != "_":
        print("=== Config ===")
        for key in (key for key in dir(config_module) if key[0] != "_"):
            blag.app.config[key] = getattr(config_module, key)
            print(key, "=", getattr(config_module, key))
        print("===+------+===")
        break

from lib.blag.rest import app


@app.route("/")
def get_index():
    with open("static/index.html") as index_file:
        return index_file.read()


if __name__ == '__main__':
    from tornado.httpserver import HTTPServer
    from tornado.ioloop import IOLoop
    from tornado.wsgi import WSGIContainer
    # placeholder for TLS
    http_server = HTTPServer(WSGIContainer(app))
    if hasattr(config_module, 'tornado_options'):
        http_server.listen(**config_module.tornado_options)
    else:
        http_server.listen(**{'address': '127.0.0.1', 'port': 25562})
    IOLoop.instance().start()
