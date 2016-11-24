from . import db_cursor, db, config
from hashlib import sha512

query = "eid,title,post,post_source".split(',')


def makepost(input):
    return dict(zip(query, input))


class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv


def check_auth(password):
    return config["password"] == sha512(password).hexdigest()


def get_post_list(count=10, start=-1):  # generator
    """Yeild a list of posts

    :returns: generator(post, [post...])
    """
    if start == -1:
        start = db_cursor.execute("SELECT MAX(eid) FROM posts").fetchone()[0]
    if start == 0:
        return  # no posts in database
    for post in db_cursor.execute(
            """SELECT eid,title,post,post_source FROM posts WHERE eid <= ?
            ORDER BY eid DESC LIMIT ?""", (start, count)):
        yield makepost(post)


def get_reverse_post_list(count=10, start=0):  # generator
    """Yield a list of posts, starting from oldest

    :returns: generator(post, [post...])
    """
    for post in db_cursor.execute(
            """SELECT eid,title,post,post_source FROM posts WHERE eid >= ?
            ORDER BY eid ASC LIMIT ?""", (start, count)):
        yield makepost(post)


def get_post(eid):
    return makepost(db_cursor.execute(
            """SELECT eid,title,post,post_source FROM posts WHERE eid = ?""",
            (eid,)))


def add_post(request):
    """Add a post to posts table

    :returns: int:new_post_eid
    """
    post = request.values.to_dict()
    db_cursor.execute("""
        INSERT INTO posts (title, post, post_source)
        VALUES (?,?, ?)
        """, (post['title'], post['post'], post['post_source']))
    db.commit()
    return db_cursor.execute("SELECT COUNT(*) FROM posts").fetchone()[0]


def update_post(eid, request):
    post = request.values.to_dict()
    db_cursor.execute("""
        UPDATE posts
        SET
            title=?,
            post=?,
            post_source=?
        WHERE eid=?
        """, (post['title'], post['post'], post['post_source'], eid))
    db.commit()
    return eid


def delete_post(eid):
    db_cursor.execute("""DELETE FROM posts WHERE eid = ?""", (eid, ))
    return eid
