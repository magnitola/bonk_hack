import time
from flask import Flask, send_from_directory, request, make_response
from server.users.users import *
import json
from server.projects.projects import *



app = Flask(__name__, static_url_path='', static_folder='client/build')


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/')
def hello_world():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/auth/login', methods=["POST"])
def login_pls():
    params = request.get_json(force=True)
    return make_response(get_login(params['login'], params['password']))


@app.route('/api/projects', methods=["POST"])
def project_pls():
    params = request.get_json(force=True)
    return make_response(json.dumps(get_projects(params['userId'], params['status'])))


@app.route('/api/project', methods=["POST"])
def project_info_pls():
    params = request.get_json(force=True)
    return make_response(json.dumps(get_project_info(params['id'])))


@app.route('/api/project/create', methods=["POST"])
def project_create_pls():
    params = request.get_json(force=True)
    return make_response(json.dumps(create_project(params['name'], params['documents'], params['userId'], params['mentor'])))


@app.route('/api/profile/get', methods=['POST'])
def get_profile_inf():
    params = request.get_json(force=True)
    return make_response(get_profile_info(params['user_id']))

@app.route('/api/profile/get/mentors', methods=['POST'])
def get_mentors_inf():
    params = request.get_json(force=True)
    return make_response(get_mentors())

@app.route('/api/students/all', methods=["POST"])
def project_pls():
    params = request.get_json(force=True)
    return make_response(json.dumps(get_all_students()))


if __name__ == '__main__':
    app.run()
