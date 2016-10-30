from flask import jsonify, abort, request
from . import util, add_route, app  # noqa F401 // @add_route()
# util.get_post_list() util.get_post() util.add_post(), util.update_post()
# util.delete_post()


@add_route('/api/v1/posts', methods=['GET'])
def get_post_list():
    return jsonify([post for post in util.get_post_list()])
    # ::TODO:: yieldify util.get_post_list()


@add_route('/api/v1/post/<int:eid>', methods=['GET'])
def get_post(eid):
    post_to_send = None
    for post in util.get_post_list():
        if post is None:
            break
        elif post["eid"] == eid:
            post_to_send = post
            break
    if not post_to_send:
        return abort(404)
    else:
        return jsonify(post_to_send)


@add_route('/api/v1/new', methods=['POST'])
def make_post():
    return jsonify({"eid": util.add_post(request)})


@add_route('/api/v1/posts/<int:eid>', methods=['PUT', 'POST'])  # don't POST
def amend_post(eid):
    return jsonify({"eid": util.update_post(eid, request)})


@add_route('/api/v1/posts/<int:eid>', methods=['DELETE'])
def delete_post(eid):
    return util.delete_post(eid)
