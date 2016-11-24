#!/usr/bin/env python3

from . import app
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from tornado.wsgi import WSGIContainer
from tornado.web import Application, RequestHandler, FallbackHandler

# placeholder for TLS Soon(tm) TODO


class IndexHandler(RequestHandler):
    def get(self):
        with open('./static/index.html') as index_file:
            return self.write(index_file.read())


if 'ssl_options' not in app.config:
    raise Exception("Field `ssl_options` not found in config")

http_server = HTTPServer(
    Application(
        [
            (r'^/$', IndexHandler),
            (r'^.*', FallbackHandler, {
                'fallback': WSGIContainer(app)
            }),
        ],
        static_path='./static'), ssl_options=app.config['ssl_options'])

http_server.listen(**{  # replace with .bind() .start()
    option: app.config[option]
    for option in app.config if option in ('address', 'port')
})
IOLoop.instance().start()
