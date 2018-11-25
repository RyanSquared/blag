import arrow

from flask import Flask
from werkzeug.contrib.fixers import ProxyFix

from approute import AppRouteView

ARROW_FORMAT = "YYYY-MM-DD HH:mm"


def create_app(config: dict = None) -> Flask:
    app = Flask(__name__)

    app.wsgi_app = ProxyFix(app.wsgi_app)

    @app.template_filter("vue")
    def vueify(item):
        return "{{ %s }}" % item

    from . import auth, models

    try:
        import config
        app.config.from_object(config)
    except Exception as e:
        print(e)

    for item in [auth, models]:
        if hasattr(item, "init_app"):
            item.init_app(app)
        if hasattr(item, "blueprint"):
            app.register_blueprint(item.blueprint)

    class Index(AppRouteView):
        template_name = "index.html"

        def populate(self) -> dict:
            items = {
                "posts": [x.serialize for x in models.Post.query.all()],
                "tags": [x.serialize for x in models.Tag.query.all()]
            }
            return items

    class NewPost(AppRouteView):
        template_name = "new.html"

    app.add_url_rule("/", view_func=Index.as_view("index"))
    app.add_url_rule("/new", view_func=NewPost.as_view("new"))

    return app
