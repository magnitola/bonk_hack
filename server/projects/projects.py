from server.projects.templates import *
from server.generals import Database


def get_projects(user_id, status):
    return Database().SqlQuery(GET_PROJECT_BY_STATUS, user_id, status)

def get_project_info(id):
    return Database().SqlQuery(GET_ALL_INFO_ABOUT_PROJECT, id)

def create_project(name, documents, author, mentor):
     return Database().SqlQuery(CREATE_PROJECT, name, documents, author, mentor, author)

def change_project_status(status, user_id, project_id):
    if status == 2:
         Database().SqlQuery(ADD_MENTOR, project_id, project_id)
    return Database().SqlQuery(CHANGE_PROJECT_STATUS, status, user_id, project_id)