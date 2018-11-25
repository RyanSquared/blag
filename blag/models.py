# vim:set foldmethod=marker:
import click
from flask.cli import with_appcontext

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError  # noqa

# {{{ Models

from sqlalchemy import Column, Date, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    date = Column(Date)
    tags = Column(String)  # JSON serialized list of tags
    content = Column(String)

    @property
    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "date": self.date,
            "tags": [int(x.strip()) for x in self.tags.split(",")],
            "content": self.content,
        }


class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True)
    name = Column(String)

    @property
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }
# }}}


# {{{ Flask Integration
db = SQLAlchemy(model_class=Base)


@click.command("init-db")
@with_appcontext
def init_db_command():
    db.create_all()
    click.echo("Initialized database")


def init_app(app):
    db.init_app(app)
    app.cli.add_command(init_db_command)
# }}}
