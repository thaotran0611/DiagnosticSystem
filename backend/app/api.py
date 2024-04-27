from fastapi import FastAPI, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from database import engine, get_db
from construct import * 
import sqlalchemy as sa
from sqlalchemy import text
import pandas as pd
import json
import random
import string
from pyhive import hive
from decimal import Decimal
import time
import logging
from middleware import db_logging
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


def mapping_column(col):
    dic = {"admittime":"Admission Time", 
           "admission_type":"Admission Type",
           "admission_location":"Admission Location",
           "dischtime":"Discharge Time",
           "ethnicity":"Ethnicity",
           "marital_status":"Marital Status",
           "gender":"Gender",
           "dob":"Date of Birth",
           "dod":"Date of Deadth",
           "dod_hosp":"DOD at Hospital",
           "dod_ssn":"dod_ssn",
           "expire_flag":"Expire Flag",
           "hadm_id":"Admission ID",
           "discharge_location":"Discharge Location",
           "startdate":"Start Date",
           "enddate":"End Date",
           "drug_type":"Drug Type",
           "drug":"Drug",
           "drug_name_poe":"Drug Name",
           "drug_name_generic":"drug_name_generic",
           "formulary_drug_cd":"formulary_drug_cd",
           "gsn":"gsn",
           "dnc":"dnc",
           "prod_strength":"prod_strength",
           "dose_val_rx":"dose_val_rx",
           "dose_unit_rx":"dose_unit_rx",
           "form_val_disp":"form_val_disp",
           "form_unit_disp":"form_unit_disp",
           "route":"Route",
           "chartdate":"Chart Date",
           "category":"Category",
           "description":"Description",
           "text":"Text"}

def transform_timestamp(df,col_list):
    for col in col_list:
        # df[col] = df[col].apply(lambda x: x.strftime('%Y-%m-%d %H:%M:%S') if x is not None else None)
        df[col] = df[col].apply(lambda x: x.strftime('%Y-%m-%d %H:%M:%S') if pd.notnull(x) and x is not None else None)

def transform_date(df,col_list):
    for col in col_list:
        # df[col] = df[col].apply(lambda x: x.strftime('%Y-%m-%d %H:%M:%S') if x is not None else None)
        df[col] = df[col].apply(lambda x: x.strftime('%Y-%m-%d') if x is not None else None)


def generate_random_string(length):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your todo list."}

@app.put("/auth", tags=["root"])
async def login(data: dict, db=Depends(get_db)) -> dict:
    print("Login: ", data)
    username = data.get("username")
    password = data.get("password")
    query = USERS.select().where(sa.and_(USERS.columns.username == username, USERS.columns.password == password))
    result = db.execute(query).fetchall()
    df = pd.DataFrame(result)
    response = df.to_dict(orient='records')
    # print(response[0])
    if len(df) > 0:
        users_list = ['DOCTOR', 'ADMINISTRATOR','ANALYST','RESEARCHER']
        code = response[0]["code"] 
        for user in users_list:
            query = eval(user).select().where(eval(user).columns.code == code)
            result = pd.DataFrame(db.execute(query).fetchall())
            if len(result) > 0:
                response[0]['role'] = user
                break
        return JSONResponse(content={"user":response[0]})
        # result = pd.DataFrame(db.execute(query).fetchall())
    else:
        pass


@app.get("/patients", response_model=dict, tags=["root"])  
async def get_patients(doctor_code, db=Depends(get_db)) -> dict: #care x adminssion x patient
    start = time.time()
    max_admittime = sa.func.max(ADMISSIONS_CHECKED.columns.admittime).label("max_admittime")
    subq = sa.select(
        CARE.columns.hadm_id,
        CARE.columns.charge_of
        ) \
        .where(CARE.columns.doctor_code == doctor_code).subquery()
    
    subq_hadm_ids = sa.select(subq.columns.hadm_id).as_scalar()

    subq2 = sa.select(
            PATIENTS_CHECKED.columns.subject_id,
            PATIENTS_CHECKED.columns.name,
            PATIENTS_CHECKED.columns.gender,
            PATIENTS_CHECKED.columns.dob,
            max_admittime
        ).select_from(
            sa.join(PATIENTS_CHECKED, ADMISSIONS_CHECKED, PATIENTS_CHECKED.columns.subject_id == ADMISSIONS_CHECKED.columns.subject_id)
        ).where(
            ADMISSIONS_CHECKED.columns.hadm_id.in_(subq_hadm_ids)
        ).group_by(
            PATIENTS_CHECKED.columns.subject_id,
            PATIENTS_CHECKED.columns.name,
            PATIENTS_CHECKED.columns.gender,
            PATIENTS_CHECKED.columns.dob,
        ).subquery()
    stmt = sa.select(
        ADMISSIONS_CHECKED.columns.hadm_id,
        subq2.columns.subject_id,
        subq2.columns.name,
        subq2.columns.gender,
        subq2.columns.dob,
        ADMISSIONS_CHECKED.columns.admission_location,
        ADMISSIONS_CHECKED.columns.admission_type,
        ADMISSIONS_CHECKED.columns.admittime,
        ADMISSIONS_CHECKED.columns.dischtime, 
        ADMISSIONS_CHECKED.columns.ethnicity,
        ADMISSIONS_CHECKED.columns.insurance,
        ADMISSIONS_CHECKED.columns.marital_status,
        ADMISSIONS_CHECKED.columns.diagnosis,
    ).select_from(
    sa.join(subq2, ADMISSIONS_CHECKED, subq2.columns.subject_id == ADMISSIONS_CHECKED.columns.subject_id)) \
    .where(subq2.columns.max_admittime == ADMISSIONS_CHECKED.columns.admittime)
    
    df = pd.DataFrame(db.execute(stmt).fetchall())
    end = time.time()
    print(end-start)
    if len(df)>0:
        transform_timestamp(df,['admittime','dischtime','dob'])
        result = df.to_dict(orient='records')
        # print(result)
    else:
        result = []
    return JSONResponse(content={"data": result})

@app.get("/patients-overview", response_model=dict, tags=["root"])  
async def get_patients_overview(doctor_code, db=Depends(get_db)) -> dict: #care x adminssion x patient
    start = time.time()

    max_admittime = sa.func.max(ADMISSIONS_CHECKED.columns.admittime).label("max_admittime")
    subq = sa.select(
        CARE.columns.hadm_id,
        CARE.columns.charge_of
        ) \
        .where(CARE.columns.doctor_code == doctor_code).subquery()
    
    subq_hadm_ids = sa.select(subq.columns.hadm_id).as_scalar()

    subq2 = sa.select(
            PATIENTS_CHECKED.columns.subject_id,
            PATIENTS_CHECKED.columns.name,
            PATIENTS_CHECKED.columns.gender,
            PATIENTS_CHECKED.columns.dob,
            max_admittime
        ).select_from(
            sa.join(PATIENTS_CHECKED, ADMISSIONS_CHECKED, PATIENTS_CHECKED.columns.subject_id == ADMISSIONS_CHECKED.columns.subject_id)
        ).where(
            ADMISSIONS_CHECKED.columns.hadm_id.in_(subq_hadm_ids)
        ).group_by( 
            PATIENTS_CHECKED.columns.subject_id,
            PATIENTS_CHECKED.columns.name,
            PATIENTS_CHECKED.columns.gender,
            PATIENTS_CHECKED.columns.dob,
        ).subquery()
    stmt = sa.select(
        ADMISSIONS_CHECKED.columns.hadm_id,
        subq2.columns.subject_id,
        subq2.columns.name,
        subq2.columns.gender,
        subq2.columns.dob,
        ADMISSIONS_CHECKED.columns.admittime,
        ADMISSIONS_CHECKED.columns.admission_type,
        ADMISSIONS_CHECKED.columns.admission_location,
        ADMISSIONS_CHECKED.columns.dischtime, 
        ADMISSIONS_CHECKED.columns.ethnicity,
        ADMISSIONS_CHECKED.columns.marital_status,
    ).select_from(
    sa.join(subq2, ADMISSIONS_CHECKED, subq2.columns.subject_id == ADMISSIONS_CHECKED.columns.subject_id)) \
    .where(subq2.columns.max_admittime == ADMISSIONS_CHECKED.columns.admittime)
    df = pd.DataFrame(db.execute(stmt).fetchall())
    end = time.time()
    print(end-start)
    # male = ((df['gender'] == 'M') & df['dischtime'].isnull()).sum()
    # female = ((df['gender'] == 'F') & df['dischtime'].isnull()).sum()
    # gender_data =[
    #     {
    #     'id': 1,
    #     'title': 'Male patients',
    #     'value': male
    #     },
    #     {
    #     'id': 1,
    #     'title': 'Female patients',
    #     'value': female
    #     }
    # ]
    if len(df)>0:
        transform_timestamp(df,['admittime','dischtime'])
        transform_date(df,['dob'])
        result = df.to_dict(orient='records')
        # print(result)
    else:
        result = []
    return JSONResponse(content={"data": result})

@app.post("/insert-self-note", tags=["root"])
async def insert_self_note(data:dict, db=Depends(get_db)) -> dict:
    # print(data)
    # note_id = generate_random_string(random.randint(4, 9))
    note_id = data.get('note_id')
    priority = data.get("priority")
    title = data.get("title")
    content = data.get("content")
    created_at = data.get("created_at")
    user_code = data.get("user_code")
    # Establish connection to Hive
    conn = hive.connect(host='localhost', port=10000, database='mimic_iii')
    # Create cursor
    cursor = conn.cursor()
    insert_query = """INSERT INTO TABLE transactional_note VALUES (%s, %s, %s, %s, %s, %s, %s,%s)"""
    # Define data to be inserted
    data = (note_id, user_code, created_at, created_at, content, priority, title, 1)

    # Execute INSERT statement
    cursor.execute(insert_query, data)

    # Commit transaction
    conn.commit()

    # Close cursor and connection
    cursor.close()
    conn.close()

    return {"message": "Note inserted successfully"}

@app.post("/update-self-note", tags=["root"])
async def update_self_note(data:dict, db=Depends(get_db)) -> dict:
    # print(data)
    note_id = data.get("note_id")
    priority = data.get("priority")
    title = data.get("title")
    content = data.get("content")
    created_at = data.get("created_at")
    user_code = data.get("user_code")
    # Establish connection to Hive
    conn = hive.connect(host='localhost', port=10000, database='mimic_iii')
    # Create cursor
    cursor = conn.cursor()
    
    update_query = """UPDATE transactional_note SET active = 0 WHERE note_id = %s"""
    cursor.execute(update_query, (note_id,))
    conn.commit()
    
    insert_query = """INSERT INTO TABLE transactional_note VALUES (%s, %s, %s, %s, %s, %s, %s,%s)"""
    # Define data to be inserted
    data = (note_id, user_code, created_at, created_at, content, priority, title, 1)
    cursor.execute(insert_query, data)
    conn.commit()

    # Close cursor and connection
    cursor.close()
    conn.close()

    return {"message": "Note inserted successfully"}

@app.post("/delete-self-note", tags=["root"])
async def delete_self_note(data:dict, db=Depends(get_db)) -> dict:
    # print(data)
    note_id = data.get("note_id")
    
    # Establish connection to Hive
    conn = hive.connect(host='localhost', port=10000, database='mimic_iii')
    # Create cursor
    cursor = conn.cursor()
    delete_query = """DELETE FROM transactional_note WHERE note_id = %s"""

    # Execute the delete query with the parameter
    cursor.execute(delete_query, (note_id,))

    # Commit the transaction
    conn.commit()

    # Close cursor and connection
    cursor.close()
    conn.close()

    return {"message": "Note inserted successfully"}

@app.post("/insert-patient-note", tags=["root"])
async def insert_self_note(data:dict, db=Depends(get_db)) -> dict:
    print("Insert Patient Note: ", data)
    # note_id = generate_random_string(random.randint(4, 9))
    note_id = data.get('note_id')
    priority = data.get("priority")
    title = data.get("title")
    content = data.get("content")
    created_at = data.get("created_at")
    user_code = data.get("user_code")
    subject_id = data.get("subject_id")

    # Establish connection to Hive
    conn = hive.connect(host='localhost', port=10000, database='mimic_iii')
    # Create cursor
    cursor = conn.cursor()
    insert_query = """INSERT INTO TABLE transactional_patient_note VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    # Define data to be inserted
    data_insert = (user_code,subject_id, created_at, created_at, content, priority, title, note_id, 1)
    # Execute INSERT statement
    cursor.execute(insert_query, data_insert)

    # Commit transaction
    conn.commit()

    # Close cursor and connection
    cursor.close()
    conn.close()
    print("Insert patient note successfully")
    return {"message": "Note inserted successfully"}

@app.post("/update-patient-note", tags=["root"])
async def update_patient_note(data:dict, db=Depends(get_db)) -> dict:
    # print(data)
    note_id = data.get("note_id")
    priority = data.get("priority")
    title = data.get("title")
    content = data.get("content")
    created_at = data.get("created_at")
    user_code = data.get("user_code")
    subject_id = data.get("subject_id")

    # Establish connection to Hive
    conn = hive.connect(host='localhost', port=10000, database='mimic_iii')
    # Create cursor
    cursor = conn.cursor()
    
    update_query = """UPDATE transactional_patient_note SET active = 0 WHERE note_id = %s"""
    cursor.execute(update_query, (note_id,))
    conn.commit()
    
    insert_query = """INSERT INTO TABLE transactional_patient_note VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    # Define data to be inserted
    data = (user_code,subject_id, created_at, created_at, content, priority, title, note_id, 1)

    cursor.execute(insert_query, data)
    conn.commit()

    # Close cursor and connection
    cursor.close()
    conn.close()

    return {"message": "Note inserted successfully"}

@app.post("/delete-patient-note", tags=["root"])
async def delete_patient_note(data:dict, db=Depends(get_db)) -> dict:
    note_id = data.get("note_id")
    
    # Establish connection to Hive
    conn = hive.connect(host='localhost', port=10000, database='mimic_iii')
    # Create cursor
    cursor = conn.cursor()
    delete_query = """DELETE FROM transactional_patient_note WHERE note_id = %s"""

    # Execute the delete query with the parameter
    cursor.execute(delete_query, (note_id,))

    # Commit the transaction
    conn.commit()

    # Close cursor and connection
    cursor.close()
    conn.close()

    return {"message": "Note inserted successfully"}


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

@app.get("/patient-notes", response_model=dict, tags=["root"]) 
async def get_patient_notes(doctor_code,subject_id ,db=Depends(get_db)) -> dict:
    subject_id = int(subject_id)
    # print(subject_id)
    # doctor_code = int(doctor_code)
    stmt = PATIENT_NOTE.select().where(sa.and_(PATIENT_NOTE.columns.doctor_code == doctor_code, PATIENT_NOTE.columns.subject_id == subject_id, 
                                               PATIENT_NOTE.columns.active == True ))\
        .order_by(sa.desc(PATIENT_NOTE.columns.updated_at))
    
    df = pd.DataFrame(db.execute(stmt).fetchall())

    if len(df)>0:
        transform_timestamp(df,['created_at','updated_at'])
        result = df.to_dict(orient='records')
        # print(result)
    else:
        result = []
    # print(result)
    return JSONResponse(content={"note": result})


@app.get("/patients-detail-admission", response_model=dict, tags=["root"])  
async def get_patients_admission_overview(doctor_code, subject_id, db=Depends(get_db)) -> dict:
    subject_id = int(subject_id)

    max_admittime = sa.func.max(ADMISSIONS_CHECKED.columns.admittime).label("max_admittime")
    
    subq = sa.select(
        ADMISSIONS_CHECKED.columns.subject_id,
        max_admittime
    )\
    .select_from(sa.join(CARE, ADMISSIONS_CHECKED, CARE.columns.hadm_id == ADMISSIONS_CHECKED.columns.hadm_id)) \
    .where(sa.and_(CARE.columns.doctor_code == doctor_code, ADMISSIONS_CHECKED.columns.subject_id == subject_id))\
    .group_by(ADMISSIONS_CHECKED.columns.subject_id).alias("subq")

    stmt = sa.select(
        ADMISSIONS_CHECKED.columns.hadm_id,        
        ADMISSIONS_CHECKED.columns.admittime,
        ADMISSIONS_CHECKED.columns.admission_type,
        ADMISSIONS_CHECKED.columns.admission_location,
        ADMISSIONS_CHECKED.columns.dischtime,
        ADMISSIONS_CHECKED.columns.discharge_location, 
        ADMISSIONS_CHECKED.columns.ethnicity,
        ADMISSIONS_CHECKED.columns.marital_status,
        ADMISSIONS_CHECKED.columns.diagnosis,        
        ADMISSIONS_CHECKED.columns.religion
    ).select_from(
        sa.join(subq, ADMISSIONS_CHECKED, subq.columns.subject_id == ADMISSIONS_CHECKED.columns.subject_id)) \
    .where(subq.columns.max_admittime >= ADMISSIONS_CHECKED.columns.admittime)

    df1 = pd.DataFrame(db.execute(stmt).fetchall())

    infomation_tag = []
    result1 = []
    if len(df1)>0:
        transform_timestamp(df1,['admittime','dischtime'])
        infomation_tag.append({"heading":"Number of admission","content": len(pd.unique(df1['hadm_id']))})  
        infomation_tag.append({"heading":"The Last Admission Time","content": max(df1['admittime'])})
        infomation_tag.append({"heading":"The Last Discharge Time","content": max(df1['dischtime'])})
        result1 = df1.to_dict(orient='records')

    # print(result1)
    
    return JSONResponse(content={"admission": result1, "infomation_tag":infomation_tag})

@app.get("/patients-detail-overview", response_model=dict, tags=["root"])  
async def get_patients_detail_overview(doctor_code, subject_id, db=Depends(get_db)) -> dict:
    subject_id = int(subject_id)
    
    stmt2 = PATIENTS_CHECKED.select().where(PATIENTS_CHECKED.columns.subject_id == subject_id)

    df2 = pd.DataFrame(db.execute(stmt2).fetchall())
    # print(df2)
    if len(df2)>0:
        transform_timestamp(df2,['dob','dod','dod_hosp','dod_ssn'])
        result2 = df2.to_dict(orient='records')
        
    # print(result2)
    
    return JSONResponse(content={"patientDetail": result2})

@app.get("/patients-detail-prescription", response_model=dict, tags=["root"])  
async def get_patients_detail_prescription(doctor_code, subject_id, db=Depends(get_db)) -> dict:
    subject_id = int(subject_id)
    doctor_code = int(doctor_code)

    max_admittime = sa.func.max(ADMISSIONS_CHECKED.columns.admittime).label("max_admittime")
    
    subq = sa.select(
        ADMISSIONS_CHECKED.columns.subject_id,
        max_admittime
    )\
    .select_from(sa.join(CARE, ADMISSIONS_CHECKED, CARE.columns.hadm_id == ADMISSIONS_CHECKED.columns.hadm_id)) \
    .where(sa.and_(CARE.columns.doctor_code == doctor_code, ADMISSIONS_CHECKED.columns.subject_id == subject_id))\
    .group_by(ADMISSIONS_CHECKED.columns.subject_id).alias("subq")

    subq_hadm_ids = sa.select(
        ADMISSIONS_CHECKED.columns.hadm_id,        
    ).select_from(
        sa.join(subq, ADMISSIONS_CHECKED, subq.columns.subject_id == ADMISSIONS_CHECKED.columns.subject_id)) \
    .where(subq.columns.max_admittime >= ADMISSIONS_CHECKED.columns.admittime).as_scalar()
    
    stmt = sa.select(PRESCRIPTIONS).where(PRESCRIPTIONS.columns.hadm_id.in_(subq_hadm_ids))
    
    df = pd.DataFrame(db.execute(stmt).fetchall())

    if len(df)>0:
        transform_timestamp(df,['startdate','enddate'])
        result = df.to_dict(orient='records')
        # print(result)
    else:
        result = []
    # print(result)
    return JSONResponse(content={"prescription": result})

@app.get("/patients-detail-note", response_model=dict, tags=["root"])  
async def get_patients_detail_note(doctor_code, subject_id, db=Depends(get_db)) -> dict:
    subject_id = int(subject_id)

    max_admittime = sa.func.max(ADMISSIONS_CHECKED.columns.admittime).label("max_admittime")
    
    subq = sa.select(
        ADMISSIONS_CHECKED.columns.subject_id,
        max_admittime
    )\
    .select_from(sa.join(CARE, ADMISSIONS_CHECKED, CARE.columns.hadm_id == ADMISSIONS_CHECKED.columns.hadm_id)) \
    .where(sa.and_(CARE.columns.doctor_code == doctor_code, ADMISSIONS_CHECKED.columns.subject_id == subject_id))\
    .group_by(ADMISSIONS_CHECKED.columns.subject_id).alias("subq")

    subq_hadm_ids = sa.select(
        ADMISSIONS_CHECKED.columns.hadm_id,        
    ).select_from(
        sa.join(subq, ADMISSIONS_CHECKED, subq.columns.subject_id == ADMISSIONS_CHECKED.columns.subject_id)) \
    .where(subq.columns.max_admittime >= ADMISSIONS_CHECKED.columns.admittime).as_scalar()
    
    stmt = sa.select(NOTEEVENTS.columns.hadm_id,
                     NOTEEVENTS.columns.chartdate,
                     NOTEEVENTS.columns.category,
                     NOTEEVENTS.columns.description,
                     NOTEEVENTS.columns.text,) \
            .select_from(NOTEEVENTS) \
            .where(NOTEEVENTS.columns.hadm_id.in_(subq_hadm_ids))
    
    df = pd.DataFrame(db.execute(stmt).fetchall())

    if len(df)>0:
        # transform_timestamp(df,['charttime','storetime'])
        transform_date(df,['chartdate'])
        result = df.to_dict(orient='records')
        # print(result)
    else:
        result = []
    # print(result)
    return JSONResponse(content={"note": result})

@app.get("/patients-annotate", response_model=dict, tags=["root"])  
async def get_patients_annotate(doctor_code, subject_id, db=Depends(get_db)) -> dict: #update this by adding parameter hadm_id
    subject_id = int(subject_id)
    stmt = sa.select(ANNOTATE.columns.disease_code,
                     ANNOTATE.columns.hadm_id,
                    ANNOTATE.columns.doctor_code,
                     ANNOTATE.columns.value,
                     ANNOTATE.columns.time) \
            .select_from(sa.join(ANNOTATE, ADMISSIONS_CHECKED, ANNOTATE.columns.hadm_id == ADMISSIONS_CHECKED.columns.hadm_id)) \
            .where(ADMISSIONS_CHECKED.columns.subject_id == subject_id)
    
    df = pd.DataFrame(db.execute(stmt).fetchall())

    if len(df)>0:
        transform_timestamp(df,['time'])
        # transform_date(df,['chartdate'])
        result = df.to_dict(orient='records')
        # print(result)
    else:
        result = []
    print(result)
    return JSONResponse(content={"annotate": result})

@app.get("/patients-detail-procedure", response_model=dict, tags=["root"])  
async def get_patients_detail_procedure(doctor_code, subject_id, db=Depends(get_db)) -> dict:
    subject_id = int(subject_id)

    max_admittime = sa.func.max(ADMISSIONS_CHECKED.columns.admittime).label("max_admittime")
    
    subq = sa.select(
        ADMISSIONS_CHECKED.columns.subject_id,
        max_admittime
    )\
    .select_from(sa.join(CARE, ADMISSIONS_CHECKED, CARE.columns.hadm_id == ADMISSIONS_CHECKED.columns.hadm_id)) \
    .where(sa.and_(CARE.columns.doctor_code == doctor_code, ADMISSIONS_CHECKED.columns.subject_id == subject_id))\
    .group_by(ADMISSIONS_CHECKED.columns.subject_id).alias("subq")

    subq_hadm_ids = sa.select(
        ADMISSIONS_CHECKED.columns.hadm_id,        
    ).select_from(
        sa.join(subq, ADMISSIONS_CHECKED, subq.columns.subject_id == ADMISSIONS_CHECKED.columns.subject_id)) \
    .where(subq.columns.max_admittime >= ADMISSIONS_CHECKED.columns.admittime).as_scalar()
    
    stmt = sa.select(PROCEDURE) \
            .where(PROCEDURE.columns.hadm_id.in_(subq_hadm_ids))
    
    df = pd.DataFrame(db.execute(stmt).fetchall())

    if len(df)>0:
        df['value'] = df['value'].apply(lambda x: float(x))

        transform_timestamp(df,['starttime','endtime','storetime','comments_date'])
        # transform_date(df,['chartdate'])
        result = df.to_dict(orient='records')
        # print(result)
    else:
        result = []
    # print(result)
    return JSONResponse(content={"procedure": result})

@app.get("/patients-detail-medicaltest", response_model=dict, tags=["root"])
async def get_patients_detail_medicaltest(doctor_code=14080, subject_id=109, db=Depends(get_db)) -> dict:
    subject_id = int(subject_id)

    max_admittime = sa.func.max(ADMISSIONS_CHECKED.columns.admittime).label("max_admittime")
    
    subq = sa.select(
        ADMISSIONS_CHECKED.columns.subject_id,
        max_admittime
    )\
    .select_from(sa.join(CARE, ADMISSIONS_CHECKED, CARE.columns.hadm_id == ADMISSIONS_CHECKED.columns.hadm_id)) \
    .where(sa.and_(CARE.columns.doctor_code == doctor_code, ADMISSIONS_CHECKED.columns.subject_id == subject_id))\
    .group_by(ADMISSIONS_CHECKED.columns.subject_id).alias("subq")

    subq_hadm_ids = sa.select(
        ADMISSIONS_CHECKED.columns.hadm_id,        
    ).select_from(
        sa.join(subq, ADMISSIONS_CHECKED, subq.columns.subject_id == ADMISSIONS_CHECKED.columns.subject_id)) \
    .where(subq.columns.max_admittime >= ADMISSIONS_CHECKED.columns.admittime).as_scalar()

    # subq_test_1 = sa.select(DO_D_LABITEMS.columns.itemid) \
    #                 .select_from(sa.join(DO_D_LABITEMS, D_ITEMS, DO_D_LABITEMS.columns.itemid == D_ITEMS.columns.itemid)) \
    #                 .where(DO_D_LABITEMS.columns.hadm_id.in_(subq_hadm_ids)) \
    #                 .group_by(DO_D_LABITEMS.columns.itemid) \
    #                 .having(sa.func.co)

    stmt = sa.select(DO_D_LABITEMS.columns.hadm_id,
                     DO_D_LABITEMS.columns.charttime,
                     DO_D_LABITEMS.columns.value,
                     DO_D_LABITEMS.columns.valueuom,
                     D_LABITEMS) \
            .select_from(sa.join(DO_D_LABITEMS, D_LABITEMS, DO_D_LABITEMS.columns.itemid == D_LABITEMS.columns.itemid)) \
            .where(DO_D_LABITEMS.columns.hadm_id.in_(subq_hadm_ids)) \
            .order_by(DO_D_LABITEMS.columns.hadm_id, D_LABITEMS.columns.itemid, DO_D_LABITEMS.columns.charttime)
            
    # stmt = sa.select(DO_D_LABITEMS.columns.hadm_id,
    #                  DO_D_LABITEMS.columns.itemid,
    #                  DO_D_LABITEMS.columns.charttime,
    #                  DO_D_LABITEMS.columns.value,
    #                  DO_D_LABITEMS.columns.valueuom
    #                  ) \
    #         .where(DO_D_LABITEMS.columns.hadm_id.in_(subq_hadm_ids))
    
    df = pd.DataFrame(db.execute(stmt).fetchall())

    if len(df)>0:
        df['value'] = df['value'].apply(lambda x: str(x))

        transform_timestamp(df,['charttime'])
        # transform_date(df,['chartdate'])
        result = df.to_dict(orient='records')
        # print(result)
    else:
        result = []
    # print(result)
    return JSONResponse(content={"medicaltest": result})

@app.get("/researcher-overview-patient", response_model=dict, tags=["root"])
async def get_patients_detail_medicaltest(researcher_code, db=Depends(get_db)) -> dict:
    stmt = sa.select(PATIENTS_CHECKED.columns.name,
                     PATIENTS_CHECKED.columns.gender)
    df = pd.DataFrame(db.execute(stmt).fetchall())

    if len(df)>0:
        # df['value'] = df['value'].apply(lambda x: str(x))

        # transform_timestamp(df,['DOB', 'DOD', 'DOD_HOSP', 'SSN'])
        # transform_date(df,['chartdate'])
        result = df.to_dict(orient='records')
        # print(result)
    else:
        result = []
    # print(result)
    return JSONResponse(content={"patient": result})

@app.get("/researcher-overview-disease", response_model=dict, tags=["root"])
async def get_patients_detail_medicaltest(researcher_code, db=Depends(get_db)) -> dict:
    sum_female = sa.select(ANNOTATE.columns.disease_code,
                           sa.func.count(PATIENTS_CHECKED.columns.gender).label('sum_of_female')) \
                .select_from(sa.join(sa.join(ANNOTATE, ADMISSIONS_CHECKED, ANNOTATE.columns.hadm_id == ADMISSIONS_CHECKED.columns.hadm_id), PATIENTS_CHECKED, ADMISSIONS_CHECKED.columns.subject_id==PATIENTS_CHECKED.columns.subject_id)) \
                .where(sa.and_(ANNOTATE.columns.value == 1, PATIENTS_CHECKED.columns.gender == 'F')) \
                .group_by(ANNOTATE.columns.disease_code)
    
    sum_male = sa.select(ANNOTATE.columns.disease_code,
                           sa.func.count(PATIENTS_CHECKED.columns.gender).label('sum_of_male')) \
                .select_from(sa.join(sa.join(ANNOTATE, ADMISSIONS_CHECKED, ANNOTATE.columns.hadm_id == ADMISSIONS_CHECKED.columns.hadm_id), PATIENTS_CHECKED, ADMISSIONS_CHECKED.columns.subject_id==PATIENTS_CHECKED.columns.subject_id)) \
                .where(sa.and_(ANNOTATE.columns.value == 1, PATIENTS_CHECKED.columns.gender == 'M')) \
                .group_by(ANNOTATE.columns.disease_code)
    
    sum_hadm_id = sa.select(ANNOTATE.columns.disease_code,
                     sa.func.count(ANNOTATE.columns.value).label('sum_of_admission'))\
            .where(ANNOTATE.columns.value == 1) \
            .group_by(ANNOTATE.columns.disease_code)
    
    stmt = sa.select(sum_hadm_id.columns.disease_code,
                     sum_hadm_id.columns.sum_of_admission,
                     sum_male.columns.sum_of_male,
                     sum_female.columns.sum_of_female) \
            .select_from(sa.join(sa.join(sum_hadm_id, sum_male, sum_hadm_id.columns.disease_code == sum_male.columns.disease_code), sum_female, sum_female.columns.disease_code == sum_hadm_id.columns.disease_code))
    
    df = pd.DataFrame(db.execute(stmt).fetchall())

    if len(df)>0:
        # df['value'] = df['value'].apply(lambda x: str(x))

        # transform_timestamp(df,['DOB', 'DOD', 'DOD_HOSP', 'SSN'])
        # transform_date(df,['chartdate'])
        result = df.to_dict(orient='records')
        # print(result)
    else:
        result = []
    # print(result)
    return JSONResponse(content={"diseases": result})

@app.get("/researcher-overview-drug", response_model=dict, tags=["root"])
async def get_patients_detail_medicaltest(researcher_code = 10040, db=Depends(get_db)) -> dict:
    stmt = text('''
                    SELECT
                        d.drug,
                        d.drug_name_poe,
                        d.drug_type,
                        d.formulary_drug_cd,
                        COUNT(CASE WHEN c.gender = 'F' THEN 1 ELSE NULL END) AS sum_of_female,
                        COUNT(CASE WHEN c.gender = 'M' THEN 1 ELSE NULL END) AS sum_of_male,
                        COUNT(a.hadm_id) AS sum_of_admission
                    FROM
                        drug d
                    LEFT OUTER JOIN
                        prescriptions a
                    ON
                        d.drug = a.drug
                        AND d.drug_name_poe = a.drug_name_poe
                        AND d.drug_type = a.drug_type
                        AND d.formulary_drug_cd = a.formulary_drug_cd
                    LEFT OUTER JOIN
                        admissions_checked b
                    ON
                        a.HADM_ID = b.HADM_ID
                    LEFT OUTER JOIN
                        patients_checked c
                    ON
                        b.SUBJECT_ID = c.SUBJECT_ID
                    GROUP BY
                        d.drug,
                        d.drug_name_poe,
                        d.drug_type,
                        d.formulary_drug_cd
            ''')
    
    df = pd.DataFrame(db.execute(stmt).fetchall())
    if len(df)>0:
        # df['value'] = df['value'].apply(lambda x: str(x))

        # transform_timestamp(df,['DOB', 'DOD', 'DOD_HOSP', 'SSN'])
        # transform_date(df,['chartdate'])
        result = df.to_dict(orient='records')
        # print(result)
    else:
        result = []
    # print(result)
    return JSONResponse(content={"drugs": result})


@app.get("/predict", response_model=dict, tags=["root"])
async def get_predict(hadm_id, db=Depends(get_db)) -> dict:
    hadm_id = int(hadm_id)
    subq = sa.select(
        ADMISSIONS_CHECKED.columns.hadm_id,
    ).select_from(ADMISSIONS_CHECKED) \
    .where(ADMISSIONS_CHECKED.columns.admittime == sa.select(ADMISSIONS_CHECKED.columns.admittime)
           .where(ADMISSIONS_CHECKED.columns.hadm_id == hadm_id) 
           .as_scalar()) \
    .as_scalar()
    
    stmt = sa.select(
        NOTEEVENTS.columns.text
    ).select_from(NOTEEVENTS) \
    .where(sa.and_(NOTEEVENTS.columns.hadm_id.in_(subq),NOTEEVENTS.columns.category == 'Discharge summary'))

    df = pd.DataFrame(db.execute(stmt).fetchall())
    text = ''
    if len(df):
        text = df['text'].str.cat(sep='\n')
    # print("Text: ", text)
    result = predict.predict(text)
    
    df_predict = pd.DataFrame(list(result.items()), columns=['disease_code', 'predict_value'])

    # print(result)
    stmt = sa.select( CARE.columns.doctor_code) \
            .select_from(CARE) \
            .where(sa.and_(CARE.columns.hadm_id == hadm_id, CARE.columns.charge_of == True))
    
    df = pd.DataFrame(db.execute(stmt).fetchall())
    doctor_code = df.iloc[0, 0]
    print(doctor_code)
    
    stmt = sa.select(ANNOTATE.columns.disease_code,
                    ANNOTATE.columns.hadm_id,
                    ANNOTATE.columns.doctor_code,
                    ANNOTATE.columns.value,
                    ANNOTATE.columns.time) \
            .select_from(ANNOTATE) \
            .where(ANNOTATE.columns.hadm_id == hadm_id)
            
    df_annotate = pd.DataFrame(db.execute(stmt).fetchall())
    if len(df_annotate) == 0:
        columns = ['disease_code','hadm_id','doctor_code','value','time']
        df_annotate = pd.DataFrame(columns = columns )
    
    df = pd.merge(df_annotate, df_predict, how="outer", on=["disease_code","disease_code"])
    # print(df)
    if len(df)>0:
        transform_timestamp(df,['time'])
        result = df.to_dict(orient='records')
    else:
        result = []
    print({"annotate": result, "doctor": doctor_code})
    return JSONResponse(content={"annotate": result, "doctor": doctor_code})
 



            
            





    
    

