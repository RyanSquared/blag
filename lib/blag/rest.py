from flask import jsonify, abort, request
from . import util, add_route, app
# util.get_post_list() util.get_post() util.add_post(), util.update_post()
# util.delete_post()


@add_route('/api/v1/config')
def get_config():
    return jsonify(sorted({
        key: getattr(app.config['config_module'], key)
        for key in dir(app.config['config_module']) if key[0] != '_'
    }.items()))


@add_route('/api/v1/posts', methods=['GET'])
def get_post_list():
    if request.args.get('start_eid'):
        return jsonify([
            post for post in util.get_post_list(start=int(
                request.args.get('start_eid')))
        ])
    else:
        return jsonify([post for post in util.get_post_list()])


@add_route('/api/v1/post/<int:eid>', methods=['GET'])
def get_post(eid):
    post = util.get_post(eid)
    if post is None:
        return abort(404)
    else:
        return jsonify(post)


@add_route('/api/v1/new', methods=['POST'])
def make_post():
    return jsonify({"eid": util.add_post(request)})


@add_route('/api/v1/posts/<int:eid>', methods=['PUT', 'POST'])  # don't POST
def amend_post(eid):
    return jsonify({"eid": util.update_post(eid, request)})


@add_route('/api/v1/posts/<int:eid>', methods=['DELETE'])
def delete_post(eid):
    return jsonify({'eid': util.delete_post(eid)})
