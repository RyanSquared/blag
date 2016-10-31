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
    http_server.listen(**{
        option: app.config[option]
        for option in app.config if option in ('address', 'port')
    })
    http_server.listen(**http_server)
    IOLoop.instance().start()
