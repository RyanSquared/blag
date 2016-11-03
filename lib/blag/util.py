from . import db_cursor, db


def get_post_list(count=10, start=-1):  # generator
    """Yeild a list of posts

    :returns: generator(post, [post...])
    """
    if start == -1:
        start = db_cursor.execute("SELECT COUNT(*) FROM posts").fetchone()[0]
    if start == 0:
        return  # no posts in database
    for post in db_cursor.execute(
            """SELECT * FROM posts ORDER BY eid DESC LIMIT ?""", (count, )):
        yield dict(zip(('eid', 'title', 'post', 'post_source'), post))


def get_post(eid):
    return dict(
        zip(('eid', 'title', 'post'), db_cursor.execute(
            """SELECT * FROM posts WHERE id = ?""", (eid,))))


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
    post = request.get_json()
    db_cursor.execute("""
        UPDATE posts
        SET
            title=?
            post=?
            post_source=?
        WHERE eid=?
            """, (post['title'], post['post'], post['post_source'], eid))
    return eid


def delete_post(eid):
    db_cursor.execute("""DELETE FROM posts WHERE eid = ?""", (eid,))
    return eid
