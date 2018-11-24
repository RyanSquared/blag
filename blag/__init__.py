from flask import Flask
from werkzeug.contrib.fixers import ProxyFix

from approute import AppRouteView


def create_app(config: dict = None) -> Flask:
    app = Flask(__name__)

    app.wsgi_app = ProxyFix(app.wsgi_app)
    app.config.from_pyfile("blag.cfg", silent=True)

    from . import auth

    for item in [auth]:
        if hasattr(item, "init_app"):
            item.init_app(app)
        if hasattr(item, "blueprint"):
            app.register_blueprint(item.blueprint)

    class Index(AppRouteView):
        template_name = "index.html"

    app.add_url_rule("/", view_func=Index.as_view("index"))

    return app
