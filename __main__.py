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
    from tornado.web import Application, RequestHandler, FallbackHandler

    # placeholder for TLS

    class IndexHandler(RequestHandler):
        def get(self):
            with open('./static/index.html') as index_file:
                return self.write(index_file.read())

    http_server = HTTPServer(
        Application(
            [
                (r'^/$', IndexHandler),
                (r'^.*', FallbackHandler, {
                    'fallback': WSGIContainer(app)
                }),
            ],
            static_path='./static'))

    http_server.listen(**{  # replace with .bind() .start()
        option: app.config[option]
        for option in app.config if option in ('address', 'port')
    })
    IOLoop.instance().start()
