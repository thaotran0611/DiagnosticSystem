from fastapi import HTTPException, Depends, FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from database import engine, get_db
from construct import * 
import sqlalchemy as sa
from sqlalchemy import create_engine
from sqlalchemy import text, case, and_, desc, literal_column
import pandas as pd
import numpy as np
import json
import random
import string
from pyhive import hive
from decimal import Decimal
import time
import logging
from middleware import db_logging
import datetime
import secrets
from database import SQLALCHEMY_DATABASE_URL_MYSQL 
from options import select_db
import sys
sys.path.append("..")

from Model import predict

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
# app.middleware('http')(db_logging)
app.add_middleware(BaseHTTPMiddleware, dispatch=db_logging)
# select_db = 'hive'
# select_db = 'mysql'

active_sessions = {"DOCTOR": {}, "RESEARCHER": {}, "ADMINISTRATOR": {}, "ANALYST": {}}

def transform_timestamp(df,col_list):
    for col in col_list:
        # df[col] = df[col].apply(lambda x: x.strftime('%Y-%m-%d %H:%M:%S') if x is not None else None)
        df[col] = df[col].apply(lambda x: x.strftime('%Y-%m-%d %H:%M:%S') if pd.notnull(x) and x is not None else None)

def transform_date(df,col_list):
    for col in col_list:
        # df[col] = df[col].apply(lambda x: x.strftime('%Y-%m-%d %H:%M:%S') if x is not None else None)
        df[col] = df[col].apply(lambda x: x.strftime('%Y-%m-%d') if x is not None else None)
        
def transform_time(df,col_list):
    for col in col_list:
        # df[col] = df[col].apply(lambda x: x.strftime('%Y-%m-%d %H:%M:%S') if x is not None else None)
        df[col] = df[col].apply(lambda x: x.strftime('%H:%M:%S') if x is not None else None)


def generate_random_string(length):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))


@app.get("/self-notes", response_model=dict, tags=["root"]) 
async def get_self_note(user_code, db=Depends(get_db)) -> dict:
    stmt = NOTE.select().where(sa.and_(NOTE.columns.user_code == user_code, NOTE.columns.active == True)).order_by(sa.desc(NOTE.columns.updated_at))
    df = pd.DataFrame(db.execute(stmt).fetchall())
    if len(df)>0:
        transform_timestamp(df,['created_at','updated_at'])
        result = df.to_dict(orient='records')
    else:
        result = []
    # print(result)
    
    return JSONResponse(content={"data": result})

@app.put("/auth", tags=["root"])
async def login(data: dict, db=Depends(get_db)) -> dict:
    username = data.get("username")
    password = data.get("password")
    query = USERS.select().where(sa.and_(USERS.columns.username == username, USERS.columns.password == password))
    result = db.execute(query).fetchall()
    df = pd.DataFrame(result)
    response = df.to_dict(orient='records')
    # print(response[0])
    if len(df) > 0:
        users_list = ['DOCTOR','RESEARCHER', 'ADMINISTRATOR','ANALYST']
        code = response[0]["code"] 
        for user in users_list:
            # print(user)
            query = eval(user).select().where(eval(user).columns.code == code)
            result = pd.DataFrame(db.execute(query).fetchall())
            if len(result) > 0:
                session_token = secrets.token_hex(16)
                response[0]['role'] = user
                response[0]['token'] = session_token
                active_sessions[user][session_token] = {"user_info": response[0]}
                # print(response[0])
                break
        return JSONResponse(content={"user":response[0]})
        # result = pd.DataFrame(db.execute(query).fetchall())
    else:
        raise HTTPException(status_code=401, detail="Invalid username or password")


@app.delete("/auth/logout", tags=["root"])
async def logout(data: dict, db=Depends(get_db)):
    session_token = data.get('session_token')
    print("Logout")
    print(session_token)

    for role_sessions in active_sessions.values():
        if session_token in role_sessions:
            # Remove the session token from the session store
            del role_sessions[session_token]
            return JSONResponse(content={"message": "Logout successful"})
    raise HTTPException(status_code=401, detail="Invalid session token")


@app.get("/currentLogin", tags=["root"])
async def currentLogin(db=Depends(get_db)) -> dict:
    # img = {"DOCTOR": '../../../img/Admin/DoctorLogo.png', "RESEARCHER": '../../../img/Admin/ResearcherLogo.png', "ADMINISTRATOR": '../../../img/Admin/AnalystLogo.png'
    #        , "ANALYST": '../../../img/Admin/AnalystLogo.png'}

    current_login = []
    for key in active_sessions.keys():
        record = {}
        # record['img'] = img[key]
        record['online'] = len(active_sessions[key])
        query = eval(key).select()
        result = pd.DataFrame(db.execute(query).fetchall())
        record['total'] = len(result)
        record['name'] = key
        current_login.append(record)
    # print(current_login)
    return JSONResponse(content={"result": current_login})

@app.get("/get-users", response_model=dict, tags=["root"])
async def get_users(db=Depends(get_db)) -> dict:
    tables = ['DOCTOR','RESEARCHER', 'ADMINISTRATOR','ANALYST']
    df = pd.DataFrame()
    for table in tables:
        stmt = sa.select(USERS.columns.code,
                         USERS.columns.name,
                         USERS.columns.gender) \
                .select_from(sa.join(USERS, eval(table), USERS.columns.code == eval(table).columns.code))
        result = pd.DataFrame(db.execute(stmt).fetchall())
        result['role'] = table
        df = pd.concat([df, result], axis=0, ignore_index=True)
    # print(df)
    result = df.to_dict(orient='records')
    return JSONResponse(content={"users": result})


@app.post("/log-action", response_model=dict, tags=["root"])
async def log_action(data: dict, db=Depends(get_db)) -> dict:
    print("Log action", data)
    df = pd.DataFrame([data])
    columns = df.columns
    
    insert_query_hive = f"""
        INSERT INTO TABLE user_action_log ({', '.join([f'`{col}`' for col in columns])})
        VALUES ({', '.join(['%s' for _ in range(len(columns))])})
        """
    
    insert_query_mysql = f"""
        INSERT INTO  user_action_log ({', '.join([f'`{col}`' for col in columns])})
        VALUES ({', '.join(['%s' for _ in range(len(columns))])})
        """    
           
    if select_db == 'hive':
        insert_query = insert_query_hive
        conn = hive.connect(host='localhost', port=10000, database='mimic_iii')
    else:
        insert_query = insert_query_mysql
        engine = create_engine(SQLALCHEMY_DATABASE_URL_MYSQL) 
        conn = engine.connect().connection
    try:
        cursor = conn.cursor()
        df['time'] = pd.to_datetime(df['time'], format='%Y-%m-%d %H:%M:%S')
        df['time'] = df['time'].dt.strftime('%Y-%m-%d %H:%M:%S')
        data_tuples = [tuple(row) for row in df.to_numpy()]
        cursor.executemany(insert_query, data_tuples)
        conn.commit()
        cursor.close()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail="An error occurred while processing the request.")
    
    return JSONResponse(content={"result": "successfully"})

@app.get("/system-log", response_model=dict, tags=["root"])
async def get_sytem_log(db=Depends(get_db)) -> dict:
    stmt = sa.select(SYSTEM_LOG)
    df = pd.DataFrame(db.execute(stmt).fetchall())
    if len(df) > 0:
        df = df.drop(columns=['id'])
        transform_timestamp(df,['created'])
        df.columns = mapping_column(df.columns)
        result = df.to_dict(orient='records')
        return JSONResponse(content={"system_log": result})
    else:
        return JSONResponse(content={"system_log": []})


#need to update
@app.get("/user-action-log", response_model=dict, tags=["root"])
async def get_user_action_log(db=Depends(get_db)) -> dict:
    subq = sa.select(DOCTOR.c.code,
                     literal_column("'doctor'").label('role'))\
            .union(sa.select(
                RESEARCHER.c.code,
                literal_column("'researcher'").label('role')
            )\
            .union(sa.select(
                ANALYST.c.code,
                literal_column("'analyst'").label('role')
            )\
            .union(sa.select(
                ADMINISTRATOR.c.code,
                literal_column("'administrator'").label('role')
            ))))\
            .alias('subq')
            
    stmt = sa.select(USER_ACTION_LOG,
                     subq.c.role)\
            .select_from(sa.join(USER_ACTION_LOG, subq, USER_ACTION_LOG.c.user_code == subq.c.code))
    
    df = pd.DataFrame(db.execute(stmt).fetchall())
    if len(df)>0:
        transform_timestamp(df,['time'])
        result = df.to_dict(orient='records')
        return JSONResponse(content={"user_action_log": result})
    else:
        return JSONResponse(content={"user_action_log": []})

@app.post("/insert-load-schedule", response_model=dict, tags=["root"])
async def get_user_action_log(data: dict, db=Depends(get_db)) -> dict:
    print(data)
    df = pd.DataFrame([data])
    df['active'] = 1
    columns = df.columns

    insert_query_hive = f"""
        INSERT INTO TABLE get_date_schedule ({', '.join([f'`{col}`' for col in columns])})
        VALUES ({', '.join(['%s' for _ in range(len(columns))])})
        """
    
    insert_query_mysql = f"""
        INSERT INTO  get_date_schedule ({', '.join([f'`{col}`' for col in columns])})
        VALUES ({', '.join(['%s' for _ in range(len(columns))])})
        """    
        
    if select_db == 'hive':
        insert_query = insert_query_hive
        conn = hive.connect(host='localhost', port=10000, database='mimic_iii')
    else:
        insert_query = insert_query_mysql
        engine = create_engine(SQLALCHEMY_DATABASE_URL_MYSQL) 
        conn = engine.connect().connection
    cursor = conn.cursor()
    try:
        df['start_date'] = pd.to_datetime(df['start_date'], format='ISO8601')
        df['start_date'] = df['start_date'].dt.date

        df['time'] = pd.to_datetime(df['time'], format='ISO8601')
        df['time'] = df['time'].dt.time
        
        df['created'] = pd.to_datetime(df['created'], format='%Y-%m-%d %H:%M:%S')
        df['created'] = df['created'].dt.strftime('%Y-%m-%d %H:%M:%S')

        # df['start_date'] = pd.to_datetime(df['start_date'], format='%Y-%m-%d')
        # df['time'] = pd.to_datetime(df['time'], format='%Y-%m-%d %H:%M:%S')

        print(df)

        data_tuples = [tuple(row) for row in df.to_numpy()]
        cursor.executemany(insert_query, data_tuples)
        conn.commit()
        cursor.close()
    except Exception as e:
        print(e)
    return JSONResponse(content={"result": "successfully"})

@app.get("/get-admin-schedule", response_model=dict, tags=["root"])
async def get_admin_schedule(user_code,db=Depends(get_db)) -> dict:
    stmt = sa.select(ADMIN_SCHEDULE).where(ADMIN_SCHEDULE.columns.administrator_code == user_code)
    df = pd.DataFrame(db.execute(stmt).fetchall())
    if len(df)>0:
        print(df)
        transform_timestamp(df,['created'])
        transform_date(df,['start_date'])
        transform_time(df,['time'])
        # df['time'] = df['time'].dt.strftime('%H:%M:%S')
        print(df)
        result = df.to_dict(orient='records')
        return JSONResponse(content={"schedule_log": result})
    else:
        return JSONResponse(content={"schedule_log": []})
    

@app.get("/user-notes", response_model=dict, tags=["root"]) 
async def get_user_notes(admin_code,user_code ,db=Depends(get_db)) -> dict:
    stmt = USER_NOTE.select().where(sa.and_(USER_NOTE.columns.admin_code == admin_code, USER_NOTE.columns.user_code == user_code, 
                                               USER_NOTE.columns.active == True ))\
        .order_by(sa.desc(USER_NOTE.columns.updated_at))
    
    df = pd.DataFrame(db.execute(stmt).fetchall())

    if len(df)>0:
        transform_timestamp(df,['created_at','updated_at'])
        result = df.to_dict(orient='records')
    else:
        result = []
    return JSONResponse(content={"note": result})
    
@app.post("/insert-note", tags=["root"])
async def insert_note(data:dict, db=Depends(get_db)) -> dict:
    # print(data)
    # note_id = generate_random_string(random.randint(4, 9))
    tables ={
        'self-note':'transactional_note',
        'patient-note': 'transactional_patient_note',
        'user-note': 'users_note',
        'disease-note': 'disease_note',
        'medicine-note': 'drug_note'
    }
    action = {
        'self-note':'insert self note',
        'patient-note': 'insert patient note',
        'user-note': 'insert user note',
        'disease-note': 'insert disease note',
        'medicine-note': 'insert medicine note'
    }
    try:
        note = data.get('note')
        type = data.get('type')
        # print(note,type)
        df = pd.DataFrame([note])
        df['updated_at'] = df['created_at']
        df['active'] = True
        columns = df.columns

        insert_query_hive = f"""
            INSERT INTO TABLE {tables[type]} ({', '.join([f'`{col}`' for col in columns])})
            VALUES ({', '.join(['%s' for _ in range(len(columns))])})
            """
        
        insert_query_mysql = f"""
            INSERT INTO  {tables[type]} ({', '.join([f'`{col}`' for col in columns])})
            VALUES ({', '.join(['%s' for _ in range(len(columns))])})
            """    
        
        
        if select_db == 'hive':
            insert_query = insert_query_hive
            conn = hive.connect(host='localhost', port=10000, database='mimic_iii')
        else:
            insert_query = insert_query_mysql
            engine = create_engine(SQLALCHEMY_DATABASE_URL_MYSQL) 
            conn = engine.connect().connection
        
        cursor = conn.cursor()

        data_tuples = [tuple(row) for row in df.to_numpy()]
        print(data_tuples)
        print(insert_query)
        cursor.executemany(insert_query, data_tuples)
        conn.commit()
        cursor.close()
        log_data = {
            'user_code': note['user_code'] if type != 'user-note' else note['admin_code'],
            'time': note['created_at'],
            'action': action[type],
            'related_item': f"Note: {note['note_id']}"
        }
            
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="An error occurred while inserting the note.")

    return {"message": "Note inserted successfully", "log": log_data}


@app.post("/update-note", tags=["root"])
async def update_note(data:dict, db=Depends(get_db)) -> dict:
    try:
        tables ={
        'self-note':'transactional_note',
        'patient-note': 'transactional_patient_note',
        'user-note': 'users_note',
        'disease-note': 'disease_note',
        'medicine-note': 'drug_note'

    }
        action = {
            'self-note':'update self note',
            'patient-note': 'update patient note',
            'user-note': 'update user note',
            'disease-note': 'update disease note',
            'medicine-note': 'update medicine note'
        }
        
        note = data.get('note')
        type = data.get('type')
        print(note,type)
        df = pd.DataFrame([note])
        df['updated_at'] = df['created_at']
        df['active'] = True
        print(df)
        columns = df.columns

        insert_query_hive = f"""
            INSERT INTO TABLE {tables[type]} ({', '.join([f'`{col}`' for col in columns])})
            VALUES ({', '.join(['%s' for _ in range(len(columns))])})
            """
        
        insert_query_mysql = f"""
            INSERT INTO  {tables[type]} ({', '.join([f'`{col}`' for col in columns])})
            VALUES ({', '.join(['%s' for _ in range(len(columns))])})
            """    
        
        
        if select_db == 'hive':
            insert_query = insert_query_hive
            conn = hive.connect(host='localhost', port=10000, database='mimic_iii')
        else:
            insert_query = insert_query_mysql
            engine = create_engine(SQLALCHEMY_DATABASE_URL_MYSQL) 
            conn = engine.connect().connection
        
        cursor = conn.cursor()
        
        update_query = f"""UPDATE {tables[type]} SET active = 0 WHERE note_id = %s"""
        cursor.execute(update_query, (note['note_id'],))
        conn.commit()
        
        data_tuples = [tuple(row) for row in df.to_numpy()]
        print(data_tuples)
        print(insert_query)
        cursor.executemany(insert_query, data_tuples)
        conn.commit()
        cursor.close()
        log_data = {
            'user_code': note['user_code'] if type != 'user-note' else note['admin_code'],
            'time': note['created_at'],
            'action': action[type],
            'related_item': f"Note: {note['note_id']}"
        }

        return {"message": "Note updated successfully", 'log': log_data}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="An error occurred while updating the note.")

@app.post("/delete-note", tags=["root"])
async def delete_note(data:dict, db=Depends(get_db)) -> dict:
    try:
        tables ={
        'self-note':'transactional_note',
        'patient-note': 'transactional_patient_note',
        'user-note': 'users_note',
        'disease-note': 'disease_note',
        'medicine-note': 'drug_note'
    }
        action = {
            'self-note':'delete self note',
            'patient-note': 'delete patient note',
            'user-note': 'delete user note',
            'disease-note': 'delete disease note',
            'medicine-note': 'delete medicine note'
        }
        
        note_id = data.get('note_id')
        type = data.get('type')
    
        if select_db == 'hive':
            conn = hive.connect(host='localhost', port=10000, database='mimic_iii')
        else:
            engine = create_engine(SQLALCHEMY_DATABASE_URL_MYSQL) 
            conn = engine.connect().connection
            
        cursor = conn.cursor()
        
        select_query = f"""SELECT * FROM {tables[type]} WHERE note_id = %s"""
        delete_query = f"""DELETE FROM {tables[type]} WHERE note_id = %s"""
        
        cursor.execute(select_query, (note_id,))
        df = pd.DataFrame(cursor.fetchall())
        df.columns = [col[0] for col in cursor.description]
        deleted_records = df.to_dict(orient='records')
        print(deleted_records)
        related_subject = ''
        
        if type == 'patient-note':
            related_subject = deleted_records[0]['subject_id']
        elif type == 'user-note':
            related_subject = deleted_records[0]['user_code']

        cursor.execute(delete_query, (note_id,))

        conn.commit()

        cursor.close()
        conn.close()

        log_data = {
            'user_code': data.get('user_code'),
            'time': data.get('time'),
            'action':  action[type],
            'related_item': f"Note: {note_id} - Related subject: {related_subject}"
        }
        return {"message": "Note deleted successfully", 'log': log_data}

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="An error occurred while updating the note.")

@app.get("/detail-user-action-log", response_model=dict, tags=["root"])
async def get_user_action_log(user_code, db=Depends(get_db)) -> dict:
    stmt = sa.select(USER_ACTION_LOG).where(USER_ACTION_LOG.columns.user_code==user_code)
    df = pd.DataFrame(db.execute(stmt).fetchall())
    if len(df)>0:
        transform_timestamp(df,['time'])
        result = df.to_dict(orient='records')
        return JSONResponse(content={"user_action_log": result})
    else:
        return JSONResponse(content={"user_action_log": []})
    

@app.get("/login-time", response_model=dict, tags=["root"]) #for overview admin page
async def get_login_time(db=Depends(get_db)) -> dict:
    stmt = USER_ACTION_LOG.select().where(USER_ACTION_LOG.c.action == 'Login').order_by(sa.desc(USER_ACTION_LOG.columns.time))
    
    df = pd.DataFrame(db.execute(stmt).fetchall())

    if len(df)>0:
        transform_timestamp(df,['time'])
        result = df.to_dict(orient='records')
        # print(result)
    else:
        result = []
    # print(result)
    return JSONResponse(content={"login_time": result})

@app.post("/load-data-manually", response_model=dict, tags=["root"])
async def insert_data_manually(data: dict,db=Depends(get_db)) -> dict:
    df = pd.DataFrame([data])
    max_id_stmt = sa.func.max(LOAD_DATA_MANUAL.columns.id).label("id")
    sub = sa.select(max_id_stmt)
    id = pd.DataFrame(db.execute(sub).fetchall())
    result = id.to_dict(orient='records')[0]['id']
    print(result)
    if result == None:
        result = 1
    df['id'] = result + 1
    # df['created_at'] = pd.to_datetime(df['created_at'], format='%Y-%m-%d %H:%M:%S')
    print(df)
    columns = df.columns

    insert_query_hive = f"""
        INSERT INTO TABLE load_data_manual ({', '.join([f'`{col}`' for col in columns])})
        VALUES ({', '.join(['%s' for _ in range(len(columns))])})
        """
    
    insert_query_mysql = f"""
        INSERT INTO  load_data_manual ({', '.join([f'`{col}`' for col in columns])})
        VALUES ({', '.join(['%s' for _ in range(len(columns))])})
        """    
    
    if select_db == 'hive':
        insert_query = insert_query_hive
        conn = hive.connect(host='localhost', port=10000, database='mimic_iii')
    else:
        insert_query = insert_query_mysql
        engine = create_engine(SQLALCHEMY_DATABASE_URL_MYSQL) 
        conn = engine.connect().connection
    
    cursor = conn.cursor()
    
    data_tuples = [tuple(row) for row in df.to_numpy()]

    cursor.executemany(insert_query, data_tuples)
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Loading Data Manually successfully"}


@app.get("/load-manual-history", response_model=dict, tags=["root"]) 
async def get_load_manual_history(db=Depends(get_db)) -> dict:
    stmt = LOAD_DATA_MANUAL.select().order_by(sa.desc(LOAD_DATA_MANUAL.columns.created_at))
    df = pd.DataFrame(db.execute(stmt).fetchall())

    if len(df)>0:
        df.drop(columns=['id'], inplace = True)
        transform_timestamp(df,['created_at'])
        result = df.to_dict(orient='records')
        # print(result)
    else:
        result = []
    # print(result)
    return JSONResponse(content={"load_data_manual_history": result})





    
    

    




            
            





    
    

