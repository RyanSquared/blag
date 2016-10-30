from flask import jsonify, abort, request
from . import app  # @app.route()
from . import util
# util.get_post_list() util.get_post() util.add_post(), util.update_post()
# util.delete_post()


@app.route('/api/v1/posts', methods=['GET'])
def get_post_list():
    return jsonify([post for post in util.get_post_list()])
    # ::TODO:: yieldify util.get_post_list()


@app.route('/api/v1/posts/<int:eid>', methods=['GET'])
def get_post(eid):
    post_to_send = None
    for post in util.get_post_list():
        if post["eid"] == eid:
            post_to_send = post
            break
    if not post_to_send:
        return abort(404)
    else:
        return jsonify(post_to_send)


@app.route('/api/v1/new', methods=['POST'])
def make_post():
    return util.add_post(request)


@app.route('/api/v1/posts/<int:eid>', methods=['PUT', 'POST'])  # don't POST
def amend_post(eid):
    return util.update_post(eid, request)


@app.route('/api/v1/posts/<int:eid>', methods=['DELETE'])
def delete_post(eid):
    return util.delete_post(eid)
