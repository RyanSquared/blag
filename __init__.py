#!/usr/bin/env python3

import config as config_module
import lib.blag as blag

_config = {item: getattr(config_module, item) for item in dir(config_module)}
blag.app.config.update(**_config)

from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from tornado.wsgi import WSGIContainer
from lib.blag.rest import app

if __name__ == '__main__':
    # placeholder for TLS
    http_server = HTTPServer(WSGIContainer(app))
    if hasattr(config_module, 'tornado_options'):
        http_server.listen(**config_module.tornado_options)
    else:
        http_server.listen(**{'address': '127.0.0.1', 'port': 25562})
    IOLoop.instance().start()
