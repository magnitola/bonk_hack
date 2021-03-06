from server.users.templates import *
from server.generals import Database
import uuid


def get_login(login, password):
    auth = Database().SqlQueryRecord(AUTHORIZE_BY_LOGIN, login, password)
    if auth:
        token = uuid.uuid4()
        auth['token'] = token
    return auth


def add_users_to_project(user_id, project_id, role):
    return Database().SqlQuery(ADD_STUDENT_TO_PROJECT, user_id, project_id, role)


def get_profile_info(user_id):
    info = Database().SqlQueryRecord(GET_INFO_FOR_PROFILE, user_id)
    info['competences'] = get_competitions_by_id(user_id)
    return info


def get_competitions_by_id(user_id):
    return Database().SqlQuery(GET_COMPETITIONS_BY_ID, user_id)


def get_all_students():
    return Database().SqlQuery(GET_STUDENTS_ALL)


def get_students_by_org(id_org):
    return Database().SqlQuery(GET_STUDENTS_BY_ORG, id_org)


def get_students_by_org_in_projects(id_org):
    return Database().SqlQuery(GET_STUDENTS_BY_ORG_IN_PROJECTS, id_org, id_org)

def watch_student(user_id, org_id):
    Database().SqlQuery(WATCH_STUDENT, user_id, org_id)

def drop_student(user_id, org_id):
    Database().SqlQuery(DROP_STUDENT, org_id, user_id)

def want_student(user_id, org_id):
    Database().SqlQuery(WANT_STUDENT, org_id, user_id)



def get_my_students_organizate(org_id):
    return Database().SqlQuery(GET_MY_STUDENTS_ORGANIZATE, org_id, org_id)

def get_wanted_students_organizate(user_id):
    return Database().SqlQuery(GET_WANTED_STUDENTS_ORGANIZATE, user_id)

def get_organizate_to_want(user_id):
    return Database().SqlQuery(GET_ORGANIZATE_TO_WANT, user_id, user_id)


def get_own_competence(user_id):
    return Database().SqlQuery(GET_OWN_COMPETENCE, user_id)

def get_wanted_competence(user_id):
    return Database().SqlQuery(GET_WANTED_COMPETENCE, user_id)
