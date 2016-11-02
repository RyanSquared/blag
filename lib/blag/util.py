from datetime import date
from . import db


def get_post_list(count=10, start=len(db)):  # generator
    """Yeild a list of posts

    :returns: array[post()]
    """
    if start == 0:
        return
    while count > 0 and start > 0:
        post = db.get(eid=start)
        if post is not None:
            post.update({'eid': start})
            count -= 1
            yield post
        start -= 1


def get_post(eid):
    return db.get(eid=eid)


def add_post(request):
    """Add a post to posts TinyDB

    :returns: '', 204 (No Content)
    """
    post = request.get_json()
    today = date.today()
    post_template = {key: post[key] for key in ('post', 'title')}  # proxy dict
    post_template.update(year=today.year, month=today.month)
    return db.insert(post_template)


def update_post(eid, request):
    post = request.get_json()
    return db.update(lambda entry: entry.update(post), eids=(eid,))[0]


def delete_post(eid):
    return db.remove(eids=(eid,))
