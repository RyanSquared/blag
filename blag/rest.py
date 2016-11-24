import base64
from flask import jsonify, abort, request
from functools import wraps
from . import util


def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        has_authorization_header = False
        auth = None
        try:
            auth = request.headers['Authorization']
            has_authorization_header = True
        except:
            return
        if not has_authorization_header:
            raise util.InvalidUsage("Missing Authorization field", 400)
        auth = base64.b64decode(auth.split(' ')[1])
        if not util.check_auth(auth):
            raise util.InvalidUsage("Invalid authorization", 401)
        return f(*args, **kwargs)
    return decorated


def add_routes(add_route, app):
    @app.errorhandler(util.InvalidUsage)
    def handle_invalid_usage(error):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response


    @add_route('/api/v1/config')
    def get_config():
        return jsonify({
            key: getattr(app.config['config_module'], key)
            for key in dir(app.config['config_module']) if key[0] != '_'
        })


    @add_route('/api/v1/posts', methods=['GET'])
    def get_post_list():
        if request.args.get('start_eid'):
            return jsonify([
                post for post in util.get_post_list(start=int(
                    request.args.get('start_eid')))
            ])
        else:
            return jsonify([post for post in util.get_post_list()])


    @add_route('/api/v1/posts/reverse', methods=['GET'])
    def get_reverse_post_list():
        if request.args.get('start_eid'):
            return jsonify([
                post for post in util.get_reverse_post_list(start=int(
                    request.args.get('start_eid')))
                ])
        else:
            return jsonify([post for post in util.get_reverse_post_list()])


    @add_route('/api/v1/post/<int:eid>', methods=['GET'])
    def get_post(eid):
        post = util.get_post(eid)
        if post is None:
            return abort(404)
        else:
            return jsonify(post)


    @add_route('/api/v1/new', methods=['POST'])
    @requires_auth
    def make_post():
        return jsonify({"eid": util.add_post(request)})


    @add_route('/api/v1/posts/<int:eid>', methods=['PUT', 'POST'])
    @requires_auth
    def amend_post(eid):
        return jsonify({"eid": util.update_post(eid, request)})


    @add_route('/api/v1/posts/<int:eid>', methods=['DELETE'])
    @requires_auth
    def delete_post(eid):
        return jsonify({'eid': util.delete_post(eid)})
