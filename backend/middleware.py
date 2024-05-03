from fastapi import Request 
from sqlalchemy import create_engine 
from pyhive import hive 
import datetime 
import random
import time 
import ast 
import json 
from database import SQLALCHEMY_DATABASE_URL_MYSQL 
from options import select_db

async def db_logging(request: Request,  call_next): 
    start_time = time.time() 
    
    # select_db = 'hive'
    # select_db = 'mysql'
    # body = await request.body() 
    # body_data = body.decode("utf-8") 
    # print(body.decode("utf-8")) 
     
    response = await call_next(request) 
    response_status_code = response.status_code 
    print(response_status_code) 
     
    request_method = request.method 
    request_url = str(request.url) 
     
    # if "/self-notes" in request_url  or "/patient-notes" in request_url : 
    #     return response  # Skip logging for this route 
     
    request_query_params = dict(request.query_params) 
    request_path_parameters = dict(request.path_params) 
    created = datetime.datetime.now() 
    timespan = time.time() - start_time 
     
    insert_query_hive = """INSERT INTO TABLE fastapi_logs VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""" 
    insert_query_mysql = """INSERT INTO fastapi_logs VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""" 
    if select_db == 'hive':
        insert_query = insert_query_hive
        conn = hive.connect(host='localhost', port=10000, database='mimic_iii')
    else:
        insert_query = insert_query_mysql
        engine = create_engine(SQLALCHEMY_DATABASE_URL_MYSQL) 
        conn = engine.connect().connection
    
    cursor = conn.cursor() 

    id = random.randint(1, 1000000)
    # Define data to be inserted 
    data = (id, int(response_status_code), request_method, request_url, json.dumps(request_query_params), json.dumps(request_path_parameters), timespan, created) 
 
    print(data) 
    cursor.execute(insert_query, data) 
 
    conn.commit() 
 
    cursor.close() 
    conn.close() 
 
    # engine = create_engine(SQLALCHEMY_DATABASE_URL_MYSQL) 
    # conn = engine.connect() 
    # insert_query = """ 
    #         INSERT INTO fastapi_logs 
    #         (response_status_code, request_method, request_url, request_query_params, request_path_parameters, timespan, created, request_data) 
    #         VALUES 
    #         (%s, %s, %s, %s, %s, %s, %s) 
    #     """ 
    # data = ( 
    #         response_status_code, 
    #         request_method, 
    #         request_url, 
    #         json.dumps(request_query_params), 
    #         json.dumps(request_path_parameters), 
    #         timespan, 
    #         created 
    #     ) 
    # conn.execute(insert_query, data) 
 
    return response
