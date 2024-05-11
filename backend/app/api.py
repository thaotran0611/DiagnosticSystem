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
           "text":"Text",
           "diagnosis":"Diagnosis",
           "insurance":"Insurance",
           "icustay_id": "ICU Stay ID",
           "valueuom":"UOM of Value",
           "starttime":"Start Time",
           "endtime": "End Time",
           "locationcategory":"Location Category",
           }
    mapped_cols = [dic.get(column, column) for column in col]
    return mapped_cols

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

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your todo list."}

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
        df.columns = mapping_column(df.columns)
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
    
    
    stmt2 = sa.select(
        ANNOTATE.columns.hadm_id,
        ANNOTATE.columns.disease_code,
        sa.func.max(ANNOTATE.columns.time).label('max_time')
    ). select_from(ANNOTATE).where(sa.and_(ANNOTATE.columns.hadm_id.in_(subq_hadm_ids), ANNOTATE.columns.value == True)) \
    .group_by(
        ANNOTATE.columns.disease_code,
        ANNOTATE.columns.hadm_id,
    ) 
    
    df = pd.DataFrame(db.execute(stmt).fetchall())
    if len(df) == 0:
        columns = db.execute(stmt).keys()
        df = pd.DataFrame(columns=columns)

    df2 = pd.DataFrame(db.execute(stmt2).fetchall())
    if len(df2) == 0:
        columns = db.execute(stmt2).keys()
        df2 = pd.DataFrame(columns=columns)
        
    df2 = df2.groupby('hadm_id')['disease_code'].agg(lambda x: ','.join(x)).reset_index()
    df_result = pd.merge(df,df2, how="left", on=["hadm_id","hadm_id"])
    print(df_result)
    # print(df)

    # end = time.time()
    # print(end-start)
    # male = ((df['gender'] == 'M') & df['dischtime'].isnull()).sum()
    # female = ((df['gender'] == 'F') & df['dischtime'].isnull()).sum()
    
    male = ((df['gender'] == 'M') ).sum()
    female = ((df['gender'] == 'F') ).sum()
    gender_data =[
        {
        'id': 1,
        'title': 'Male patients',
        'value': int(male)
        },
        {
        'id': 2,
        'title': 'Female patients',
        'value': int(female)
        }
    ]
    if len(df_result)>0:
        transform_timestamp(df_result,['admittime','dischtime'])
        transform_date(df_result,['dob'])
        df_result.columns = mapping_column(df_result.columns)
        df_result.fillna(value=np.nan, inplace=True)
        df_result.replace({np.nan: None}, inplace=True)
        result = df_result.to_dict(orient='records')
        # print(result)
    else:
        result = []
    return JSONResponse(content={"data": result, "genderData":gender_data})

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
    stmt = PATIENT_NOTE.select().where(sa.and_(PATIENT_NOTE.columns.user_code == doctor_code, PATIENT_NOTE.columns.subject_id == subject_id, 
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

    df = pd.DataFrame(db.execute(stmt).fetchall())

    infomation_tag = []
    result1 = []
    if len(df)>0:
        transform_timestamp(df,['admittime','dischtime'])
        infomation_tag.append({"heading":"Number of admission","content": len(pd.unique(df['hadm_id']))})  
        infomation_tag.append({"heading":"The Last Admission Time","content": max(df['admittime'])})
        infomation_tag.append({"heading":"The Last Discharge Time","content": max(df['dischtime'])})
        df.columns = mapping_column(df.columns)
        result1 = df.to_dict(orient='records')

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
        df.columns = mapping_column(df.columns)
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
        df.columns = mapping_column(df.columns)
        result = df.to_dict(orient='records')

        # print(result)
    else:
        result = []
    # print(result)
    return JSONResponse(content={"note": result})

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
    # print(len(df))
    if len(df)>0:
        df = df.drop(columns=['row_id','subject_id'])
        df['value'] = df['value'].apply(lambda x: float(x))

        transform_timestamp(df,['starttime','endtime','storetime','comments_date'])
        # transform_date(df,['chartdate'])
        df.columns = mapping_column(df.columns)
        result = df.to_dict(orient='records')
    else:
        result = []
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
    
    # sum_hadm_id = sa.select(ANNOTATE.columns.disease_code,
    #                  sa.func.count(ANNOTATE.columns.hadm_id).label('sum_of_admission'))\
    #         .where(ANNOTATE.columns.value == 1) \
    #         .group_by(ANNOTATE.columns.disease_code)
    
    # Define the subquery
    subquery = sa.select(
        ANNOTATE.columns.disease_code,
        ANNOTATE.columns.hadm_id,
        sa.func.max(ANNOTATE.columns.time).label('max_time')
    ).where(
        ANNOTATE.columns.value == 1
    ).group_by(
        ANNOTATE.columns.disease_code,
        ANNOTATE.columns.hadm_id
    ).alias("subquery")

    # Define the outer query
    sum_hadm_id = sa.select(
        subquery.columns.disease_code,
        sa.func.count(subquery.columns.hadm_id).label('sum_of_admission')
    ).group_by(
        subquery.columns.disease_code
    )

    stmt = sa.select(sum_hadm_id.columns.disease_code,
                     sum_hadm_id.columns.sum_of_admission,
                     sum_male.columns.sum_of_male,
                     sum_female.columns.sum_of_female) \
            .select_from(sa.join(sa.join(sum_hadm_id, sum_male, sum_hadm_id.columns.disease_code == sum_male.columns.disease_code), sum_female, sum_female.columns.disease_code == sum_hadm_id.columns.disease_code))
    
    df = pd.DataFrame(db.execute(stmt).fetchall())

    if len(df)>0:
        result = df.to_dict(orient='records')
    else:
        result = []
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
@app.get("/detailmedicine-general", response_model=dict, tags=["root"])
async def detail_medicine_general(drug = 'aspirin', drug_name_poe = 'aspirin', drug_type = 'main', formulary_drug_cd='asa81', db=Depends(get_db)) -> dict:
    stmt = text('''
                SELECT
                    b.hadm_id,
                    d.drug,
                    d.drug_name_poe,
                    d.drug_type,
                    d.formulary_drug_cd,
                    c.gender,
                    c.dob,
                    c.dod,
                    b.admission_type,
                    b.admission_location,
                    b.religion,
                    b.marital_status,
                    b.ethnicity,
                    b.insurance,
                    ifnull(n.Alcohol_Abuse, 0) as Alcohol_Abuse,
                    ifnull(n.Chronic_Neurologic_Dystrophies, 0) as Chronic_Neurologic_Dystrophies,
                    ifnull(n.Substance_Abuse, 0) as Substance_Abuse,
                    ifnull(n.Chronic_Pain, 0) as Chronic_Pain,
                    ifnull(n.Depression, 0) as Depression,
                    ifnull(n.Adv_Heart_Disease, 0) as Adv_Heart_Disease,
                    ifnull(n.Metastatic_Cancer, 0) as Metastatic_Cancer,
                    ifnull(n.Adv_Lung_Disease, 0) as Adv_Lung_Disease,
                    ifnull(n.Obesity, 0) as Obesity,
                    ifnull(n.Psychiatric_Disorders, 0) as Psychiatric_Disorders
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
                LEFT OUTER JOIN
                    (Select annotate1.hadm_id, MAX(annotate1.time), MAX(annotate1.Alcohol_Abuse) as Alcohol_Abuse,  MAX(annotate1.Chronic_Neurologic_Dystrophies) as Chronic_Neurologic_Dystrophies, MAX(annotate1.Substance_Abuse) as Substance_Abuse, MAX(annotate1.Chronic_Pain) as Chronic_Pain, MAX(annotate1.Depression) as Depression, MAX(annotate1.Adv_Heart_Disease) as Adv_Heart_Disease, MAX(annotate1.Metastatic_Cancer) as Metastatic_Cancer, MAX(annotate1.Adv_Lung_Disease) as Adv_Lung_Disease, MAX(annotate1.Obesity) as Obesity, MAX(annotate1.Psychiatric_Disorders) as Psychiatric_Disorders from (SELECT *, CASE 
                        WHEN  annotate.disease_code='AA' and annotate.value=1 THEN 1
                        ELSE 0
                    END AS 'Alcohol_Abuse',
                    CASE 
                        WHEN  annotate.disease_code='CND'and annotate.value=1  THEN 1
                        ELSE 0
                    END AS 'Chronic_Neurologic_Dystrophies',
                    CASE 
                        WHEN  annotate.disease_code='SA'and annotate.value=1  THEN 1
                        ELSE 0
                    END AS 'Substance_Abuse',
                    CASE 
                        WHEN  annotate.disease_code='CP'and annotate.value=1  THEN 1
                        ELSE 0
                    END AS 'Chronic_Pain',
                    CASE 
                        WHEN  annotate.disease_code='Dep'and annotate.value=1  THEN 1
                        ELSE 0
                    END AS 'Depression',
                    CASE 
                        WHEN  annotate.disease_code='HD'and annotate.value=1  THEN 1
                        ELSE 0
                    END AS 'Adv_Heart_Disease',
                    CASE 
                        WHEN  annotate.disease_code='LD'and annotate.value=1  THEN 1
                        ELSE 0
                    END AS 'Adv_Lung_Disease',
                    CASE 
                        WHEN  annotate.disease_code='MC'and annotate.value=1  THEN 1
                        ELSE 0
                    END AS 'Metastatic_Cancer',
                    CASE 
                        WHEN  annotate.disease_code='Ob'and annotate.value=1  THEN 1
                        ELSE 0
                    END AS 'Obesity',
                    CASE 
                        WHEN  annotate.disease_code='PD'and annotate.value=1  THEN 1
                        ELSE 0
                    END AS 'Psychiatric_Disorders'
                    FROM dacn.annotate)  as annotate1 group by annotate1.hadm_id) as n
                ON n.hadm_id = b.hadm_id
                WHERE   d.drug = :drug
                    AND d.drug_name_poe = :drug_name_poe
                    AND d.drug_type = :drug_type
                    AND d.formulary_drug_cd = :formulary_drug_cd
                ORDER BY b.hadm_id
            ''')
    stmt = stmt.bindparams(
        drug = drug,
        drug_name_poe = drug_name_poe,
        drug_type = drug_type,
        formulary_drug_cd = formulary_drug_cd
    )
    df = pd.DataFrame(db.execute(stmt).fetchall())
    if len(df)>0:
        # df['value'] = df['value'].apply(lambda x: str(x))

        transform_timestamp(df,['dob', 'dod'])
        # transform_date(df,['chartdate'])
        result = df.to_dict(orient='records')
        # print(result)
    else:
        result = []
    # print(result)
    return JSONResponse(content={"drugs": result})

@app.get("/detailmedicine-co-prescribed-medication", response_model=dict, tags=["root"])
async def detail_co_prescribed_medication(drug = 'aspirin', drug_name_poe = 'aspirin', drug_type = 'main', formulary_drug_cd='asa81', db=Depends(get_db)) -> dict:
    stmt = text('''
                SELECT
                    a.drug,
                    a.drug_name_poe,
                    a.drug_type,
                    a.formulary_drug_cd,
                    ifnull(n.Alcohol_Abuse, 0) as Alcohol_Abuse,
                    ifnull(n.Chronic_Neurologic_Dystrophies, 0) as Chronic_Neurologic_Dystrophies,
                    ifnull(n.Substance_Abuse, 0) as Substance_Abuse,
                    ifnull(n.Chronic_Pain, 0) as Chronic_Pain,
                    ifnull(n.Depression, 0) as Depression,
                    ifnull(n.Adv_Heart_Disease, 0) as Adv_Heart_Disease,
                    ifnull(n.Metastatic_Cancer, 0) as Metastatic_Cancer,
                    ifnull(n.Adv_Lung_Disease, 0) as Adv_Lung_Disease,
                    ifnull(n.Obesity, 0) as Obesity,
                    ifnull(n.Psychiatric_Disorders, 0) as Psychiatric_Disorders
                FROM prescriptions a
                LEFT OUTER JOIN
                    (Select annotate1.hadm_id, MAX(annotate1.time), MAX(annotate1.Alcohol_Abuse) as Alcohol_Abuse,  MAX(annotate1.Chronic_Neurologic_Dystrophies) as Chronic_Neurologic_Dystrophies, MAX(annotate1.Substance_Abuse) as Substance_Abuse, MAX(annotate1.Chronic_Pain) as Chronic_Pain, MAX(annotate1.Depression) as Depression, MAX(annotate1.Adv_Heart_Disease) as Adv_Heart_Disease, MAX(annotate1.Metastatic_Cancer) as Metastatic_Cancer, MAX(annotate1.Adv_Lung_Disease) as Adv_Lung_Disease, MAX(annotate1.Obesity) as Obesity, MAX(annotate1.Psychiatric_Disorders) as Psychiatric_Disorders from (SELECT *, CASE 
                        WHEN  annotate.disease_code='AA' and annotate.value=1 THEN 1
                        ELSE 0
                    END AS 'Alcohol_Abuse',
                    CASE 
                        WHEN  annotate.disease_code='CND'and annotate.value=1  THEN 1
                        ELSE 0
                    END AS 'Chronic_Neurologic_Dystrophies',
                    CASE 
                        WHEN  annotate.disease_code='SA'and annotate.value=1  THEN 1
                        ELSE 0
                    END AS 'Substance_Abuse',
                    CASE 
                        WHEN  annotate.disease_code='CP'and annotate.value=1  THEN 1
                        ELSE 0
                    END AS 'Chronic_Pain',
                    CASE 
                        WHEN  annotate.disease_code='Dep'and annotate.value=1  THEN 1
                        ELSE 0
                    END AS 'Depression',
                    CASE 
                        WHEN  annotate.disease_code='HD'and annotate.value=1  THEN 1
                        ELSE 0
                    END AS 'Adv_Heart_Disease',
                    CASE 
                        WHEN  annotate.disease_code='LD'and annotate.value=1  THEN 1
                        ELSE 0
                    END AS 'Adv_Lung_Disease',
                    CASE 
                        WHEN  annotate.disease_code='MC'and annotate.value=1  THEN 1
                        ELSE 0
                    END AS 'Metastatic_Cancer',
                    CASE 
                        WHEN  annotate.disease_code='Ob'and annotate.value=1  THEN 1
                        ELSE 0
                    END AS 'Obesity',
                    CASE 
                        WHEN  annotate.disease_code='PD'and annotate.value=1  THEN 1
                        ELSE 0
                    END AS 'Psychiatric_Disorders'
                    FROM dacn.annotate)  as annotate1 group by annotate1.hadm_id) as n
                ON n.hadm_id = a.hadm_id
                WHERE a.hadm_id in (select hadm_id from prescriptions 
                                    where drug = :drug and drug_name_poe = :drug_name_poe and drug_type = :drug_type and formulary_drug_cd = :formulary_drug_cd)
                ''')
    
    stmt = stmt.bindparams(
        drug = drug,
        drug_name_poe = drug_name_poe,
        drug_type = drug_type,
        formulary_drug_cd = formulary_drug_cd
    )

    df = pd.DataFrame(db.execute(stmt).fetchall())
    if len(df)>0:
        # df['value'] = df['value'].apply(lambda x: str(x))

        # transform_timestamp(df,['dob', 'dod'])
        # transform_date(df,['chartdate'])
        result = df.to_dict(orient='records')
        # print(result)
    else:
        result = []
    # print(result)
    return JSONResponse(content={"otherdrugs": result})

@app.get("/researcher-disease-all-admission", response_model=dict, tags=["root"])
async def get_predict(db=Depends(get_db)) -> dict:
    df = pd.DataFrame(db.query(ANNOTATE.columns.hadm_id).distinct().all())
    if len(df)>0:
        result = df.to_dict(orient='records')
    else:
        result = []
    return JSONResponse(content={"admissions": result})

@app.get("/predict", response_model=dict, tags=["root"])
async def predict_disease(hadm_id, db=Depends(get_db)) -> dict:
    hadm_id = int(hadm_id)
    subq = sa.select(
        [ADMISSIONS_CHECKED.columns.hadm_id]
    ).select_from(ADMISSIONS_CHECKED) \
    .where(sa.and_(
        ADMISSIONS_CHECKED.columns.subject_id == sa.select([ADMISSIONS_CHECKED.columns.subject_id])
            .where(ADMISSIONS_CHECKED.columns.hadm_id == hadm_id),
        ADMISSIONS_CHECKED.columns.admittime < sa.select([ADMISSIONS_CHECKED.columns.admittime])
            .where(ADMISSIONS_CHECKED.columns.hadm_id == hadm_id)
    )) \
    .order_by(ADMISSIONS_CHECKED.columns.admittime.desc()) \
    .limit(1) 

    df = pd.DataFrame(db.execute(subq).fetchall())
    hadm_id_list = list(df['hadm_id'])
    
    stmt = sa.select(
        NOTEEVENTS.columns.text
    ).select_from(NOTEEVENTS) \
    .where(sa.and_(NOTEEVENTS.columns.hadm_id.in_(hadm_id_list),NOTEEVENTS.columns.category == 'Discharge summary'))

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
    
    subq = sa.select(
        ANNOTATE.columns.disease_code,
        ANNOTATE.columns.hadm_id,
        sa.func.max(ANNOTATE.columns.time).label('max_time')
    ) \
    .select_from(ANNOTATE) \
    .where(ANNOTATE.columns.hadm_id == hadm_id) \
    .group_by(
        ANNOTATE.columns.disease_code,
        ANNOTATE.columns.hadm_id,
    ) \
    .alias()

# Main query to retrieve the record with the maximum time based on other attributes
    stmt = sa.select(
        ANNOTATE.columns.disease_code,
        ANNOTATE.columns.value,
        ANNOTATE.columns.note,
        ANNOTATE.columns.time
    ) \
    .select_from(ANNOTATE) \
    .join(
        subq,
        sa.and_(
            ANNOTATE.columns.disease_code == subq.c.disease_code,
            ANNOTATE.columns.hadm_id == subq.c.hadm_id,
            ANNOTATE.columns.time == subq.c.max_time
        )
    )
    # stmt = sa.select(ANNOTATE.columns.disease_code,
    #                 ANNOTATE.columns.doctor_code,
    #                 ANNOTATE.columns.value,
    #                 ANNOTATE.columns.note,
    #                 ANNOTATE.columns.time) \
    #         .select_from(ANNOTATE) \
    #         .where(ANNOTATE.columns.hadm_id == hadm_id)
            
    df_annotate = pd.DataFrame(db.execute(stmt).fetchall()).drop_duplicates()
    if len(df_annotate) == 0:
        columns = ['disease_code','doctor_code','value','note','time']
        df_annotate = pd.DataFrame(columns = columns )
    
    df = pd.merge(df_annotate, df_predict, how="outer", on=["disease_code","disease_code"])
    # print(df)
    if len(df)>0:
        transform_timestamp(df,['time'])
        df.fillna(value=np.nan, inplace=True)
        df.replace({np.nan: None}, inplace=True)
        print(df)
        result = df.to_dict(orient='records')
    else:
        result = []
    print({"annotate": result, "doctor": doctor_code})
    return JSONResponse(content={"annotate": result, "doctor": doctor_code})

@app.post("/update-annotate", response_model=dict, tags=["root"])
async def update_annotate(data:dict, db=Depends(get_db)) -> dict:
    doctor_code = data.get("doctor_code")
    hadm_id = int(data.get("hadm_id"))
    df_data = data.get("data")
    df = pd.DataFrame(df_data)
    df['doctor_code'] = doctor_code
    df['hadm_id'] = hadm_id
    df.drop(columns='predict_value',inplace = True)
    columns = df.columns

    insert_query_hive = f"""
        INSERT INTO TABLE annotate ({', '.join([f'`{col}`' for col in columns])})
        VALUES ({', '.join(['%s' for _ in range(len(columns))])})
        """
    
    insert_query_mysql = f"""
        INSERT INTO  annotate ({', '.join([f'`{col}`' for col in columns])})
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
        df['time'] = pd.to_datetime(df['time'], format='%Y-%m-%d %H:%M:%S')
        df = df[df['time'].dt.date == datetime.datetime.now().date()]
        print(insert_query)
        data_tuples = [tuple(row) for row in df.to_numpy()]
        # Insert data into Hive table using executemany
        cursor.executemany(insert_query, data_tuples)
        conn.commit()
        cursor.close()
    except:
        df['time'] = df['time'].dt.strftime('%Y-%m-%d %H:%M:%S')
        data_tuples = [tuple(row) for row in df.to_numpy()]
        cursor.executemany(insert_query, data_tuples)
        conn.commit()
        cursor.close()

    log_data = {
            'user_code': doctor_code,
            'time': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'action': 'Update Annotation',
            'related_item': f"Admission ID: {hadm_id}"
        }
    return JSONResponse(content={"result": "successfully", 'log': log_data})

@app.get("/detaildisease-general", response_model=dict, tags=["root"])
async def detail_disease_general(disease_code='AA', db=Depends(get_db)) -> dict:
    subquery = sa.select(
        ANNOTATE.columns.disease_code,
        ANNOTATE.columns.hadm_id,
        sa.func.max(ANNOTATE.columns.time).label('max_time')
    ).where(
        ANNOTATE.columns.value == 1
    ).group_by(
        ANNOTATE.columns.disease_code,
        ANNOTATE.columns.hadm_id
    ).alias("subquery")

    stmt = sa.select(
        ADMISSIONS_CHECKED.columns.hadm_id,
        subquery.columns.disease_code,
        DISEASE.columns.name,
        PATIENTS_CHECKED.columns.gender,
        ADMISSIONS_CHECKED.columns.marital_status,
        ADMISSIONS_CHECKED.columns.religion,
        ADMISSIONS_CHECKED.columns.ethnicity,
        PATIENTS_CHECKED.columns.dob,
        PATIENTS_CHECKED.columns.dod,
        # (sa.func.extract('year', PATIENTS_CHECKED.columns.dod) - sa.func.extract('year', PATIENTS_CHECKED.columns.dob)).label('age_of_death')
    )\
    .select_from(sa.join(sa.join(sa.join(subquery, DISEASE, subquery.columns.disease_code == DISEASE.columns.disease_code), ADMISSIONS_CHECKED, ADMISSIONS_CHECKED.columns.hadm_id == subquery.columns.hadm_id), PATIENTS_CHECKED, PATIENTS_CHECKED.columns.subject_id == ADMISSIONS_CHECKED.columns.subject_id))\
    .where(subquery.columns.disease_code == disease_code) \
    .order_by(ADMISSIONS_CHECKED.columns.hadm_id)

    df = pd.DataFrame(db.execute(stmt).fetchall())
    if len(df)>0:
        transform_timestamp(df,['dob', 'dod'])
        result = df.to_dict(orient='records')
    else:
        result = []
    return JSONResponse(content={"disease": result})

@app.get("/detaildisease-otherdiseases", response_model=dict, tags=["root"])
async def detaildisease_otherdiseases(disease_code='AA', db=Depends(get_db)) -> dict:
    subq1 = sa.select(
        ANNOTATE.columns.doctor_code,
        ANNOTATE.columns.hadm_id,
        ANNOTATE.columns.disease_code,
        ANNOTATE.columns.value,
        ANNOTATE.columns.time,
        case((and_(ANNOTATE.columns.disease_code == 'AA', ANNOTATE.columns.value == True), 1), else_=0).label('AA'),
        case((and_(ANNOTATE.columns.disease_code == 'CND', ANNOTATE.columns.value == True), 1), else_=0).label('CND'),
        case((and_(ANNOTATE.columns.disease_code == 'SA', ANNOTATE.columns.value == True), 1), else_=0).label('SA'),
        case((and_(ANNOTATE.columns.disease_code == 'CP', ANNOTATE.columns.value == True), 1), else_=0).label('CP'),
        case((and_(ANNOTATE.columns.disease_code == 'Dep', ANNOTATE.columns.value == True), 1), else_=0).label('Dep'),
        case((and_(ANNOTATE.columns.disease_code == 'MC', ANNOTATE.columns.value == True), 1), else_=0).label('MC'),
        case((and_(ANNOTATE.columns.disease_code == 'Ob', ANNOTATE.columns.value == True), 1), else_=0).label('Ob'),
        case((and_(ANNOTATE.columns.disease_code == 'PD', ANNOTATE.columns.value == True), 1), else_=0).label('PD'),
        case((and_(ANNOTATE.columns.disease_code == 'HD', ANNOTATE.columns.value == True), 1), else_=0).label('HD'),
        case((and_(ANNOTATE.columns.disease_code == 'LD', ANNOTATE.columns.value == True), 1), else_=0).label('LD'),
    )\
    .select_from(ANNOTATE).alias('subq1')

    subq2 = sa.select(
        subq1.columns.hadm_id,
        sa.func.max(subq1.columns.time).label('time'),
        sa.func.max(subq1.columns.AA).label('AA'),
        sa.func.max(subq1.columns.CND).label('CND'),
        sa.func.max(subq1.columns.SA).label('SA'),
        sa.func.max(subq1.columns.CP).label('CP'),
        sa.func.max(subq1.columns.Dep).label('Dep'),
        sa.func.max(subq1.columns.MC).label('MC'),
        sa.func.max(subq1.columns.Ob).label('Ob'),
        sa.func.max(subq1.columns.PD).label('PD'),
        sa.func.max(subq1.columns.HD).label('HD'),
        sa.func.max(subq1.columns.LD).label('LD')
    )\
    .select_from(subq1)\
    .group_by(subq1.columns.hadm_id).alias('subq2')

    stmt = sa.select(
        ADMISSIONS_CHECKED.columns.hadm_id,
        PATIENTS_CHECKED.columns.gender,
        ADMISSIONS_CHECKED.columns.marital_status,
        ADMISSIONS_CHECKED.columns.religion,
        ADMISSIONS_CHECKED.columns.ethnicity,
        PATIENTS_CHECKED.columns.dob,
        PATIENTS_CHECKED.columns.dod,
        # (sa.func.year(PATIENTS_CHECKED.columns.dod) - sa.func.year(PATIENTS_CHECKED.columns.dob)).label('age_of_death'),
        subq2.columns.AA,
        subq2.columns.CND,
        subq2.columns.SA,
        subq2.columns.CP,
        subq2.columns.Dep,
        subq2.columns.MC,
        subq2.columns.Ob,
        subq2.columns.PD,
        subq2.columns.HD,
        subq2.columns.LD,
    ).select_from(sa.join(sa.join(subq2, ADMISSIONS_CHECKED, subq2.columns.hadm_id == ADMISSIONS_CHECKED.columns.hadm_id), PATIENTS_CHECKED, PATIENTS_CHECKED.c.subject_id == ADMISSIONS_CHECKED.c.subject_id))\
    .where(subq2.columns[disease_code] == 1)\
    .order_by(ADMISSIONS_CHECKED.c.hadm_id)

    df = pd.DataFrame(db.execute(stmt).fetchall())
    if len(df)>0:
        # df['value'] = df['value'].apply(lambda x: str(x))

        transform_timestamp(df,['dob','dod'])
        # transform_date(df,['chartdate'])
        result = df.to_dict(orient='records')
        # print(result)
    else:
        result = []
    # print(result)
    return JSONResponse(content={"otherdiseases": result})

@app.get("/detaildisease-prescriptions", response_model=dict, tags=["root"])
async def detaildisease_prescriptions(disease_code='AA', db=Depends(get_db)) -> dict:
    subq1 = sa.select(
        ANNOTATE.columns.doctor_code,
        ANNOTATE.columns.hadm_id,
        ANNOTATE.columns.disease_code,
        ANNOTATE.columns.value,
        ANNOTATE.columns.time,
        case((and_(ANNOTATE.columns.disease_code == 'AA', ANNOTATE.columns.value == True), 1), else_=0).label('AA'),
        case((and_(ANNOTATE.columns.disease_code == 'CND', ANNOTATE.columns.value == True), 1), else_=0).label('CND'),
        case((and_(ANNOTATE.columns.disease_code == 'SA', ANNOTATE.columns.value == True), 1), else_=0).label('SA'),
        case((and_(ANNOTATE.columns.disease_code == 'CP', ANNOTATE.columns.value == True), 1), else_=0).label('CP'),
        case((and_(ANNOTATE.columns.disease_code == 'Dep', ANNOTATE.columns.value == True), 1), else_=0).label('Dep'),
        case((and_(ANNOTATE.columns.disease_code == 'MC', ANNOTATE.columns.value == True), 1), else_=0).label('MC'),
        case((and_(ANNOTATE.columns.disease_code == 'Ob', ANNOTATE.columns.value == True), 1), else_=0).label('Ob'),
        case((and_(ANNOTATE.columns.disease_code == 'PD', ANNOTATE.columns.value == True), 1), else_=0).label('PD'),
        case((and_(ANNOTATE.columns.disease_code == 'HD', ANNOTATE.columns.value == True), 1), else_=0).label('HD'),
        case((and_(ANNOTATE.columns.disease_code == 'LD', ANNOTATE.columns.value == True), 1), else_=0).label('LD'),
    )\
    .select_from(ANNOTATE).alias('subq1')

    subq2 = sa.select(
        subq1.columns.hadm_id.label('hadmid'),
        sa.func.max(subq1.columns.time).label('time'),
        sa.func.max(subq1.columns.AA).label('AA'),
        sa.func.max(subq1.columns.CND).label('CND'),
        sa.func.max(subq1.columns.SA).label('SA'),
        sa.func.max(subq1.columns.CP).label('CP'),
        sa.func.max(subq1.columns.Dep).label('Dep'),
        sa.func.max(subq1.columns.MC).label('MC'),
        sa.func.max(subq1.columns.Ob).label('Ob'),
        sa.func.max(subq1.columns.PD).label('PD'),
        sa.func.max(subq1.columns.HD).label('HD'),
        sa.func.max(subq1.columns.LD).label('LD')
    )\
    .select_from(subq1)\
    .group_by(subq1.columns.hadm_id).alias('subq2')

    subq3 = sa.select(
        PRESCRIPTIONS,
        subq2
    )\
    .select_from(sa.join(PRESCRIPTIONS, subq2, PRESCRIPTIONS.c.hadm_id == subq2.c.hadmid))\
    .where(subq2.c[disease_code] == 1).alias('subq3')

    stmt = sa.select(subq3.c.drug,
                     subq3.c.drug_type,
                     subq3.c.drug_name_poe,
                     subq3.c.drug_name_generic,
                     subq3.c.AA,
                     subq3.c.CND,
                     subq3.c.SA,
                     subq3.c.CP,
                     subq3.c.Dep,
                     subq3.c.MC,
                     subq3.c.Ob,
                     subq3.c.PD,
                     subq3.c.HD,
                     subq3.c.LD,
                     sa.func.count().label('frequency'))\
            .select_from(subq3)\
            .group_by(subq3.c.drug,
                     subq3.c.drug_type,
                     subq3.c.drug_name_poe,
                     subq3.c.drug_name_generic,
                     subq3.c.AA,
                     subq3.c.CND,
                     subq3.c.SA,
                     subq3.c.CP,
                     subq3.c.Dep,
                     subq3.c.MC,
                     subq3.c.Ob,
                     subq3.c.PD,
                     subq3.c.HD,
                     subq3.c.LD)\
            .order_by(desc(sa.func.count()))
    
    df = pd.DataFrame(db.execute(stmt).fetchall())
    if len(df)>0:
        # df['value'] = df['value'].apply(lambda x: str(x))

        # transform_timestamp(df,['dob','dod'])
        # transform_date(df,['chartdate'])
        result = df.to_dict(orient='records')
        # print(result)
    else:
        result = []
    # print(result)
    return JSONResponse(content={"prescriptions": result})




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
    # print("Log action", data)
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
    
    cursor = conn.cursor()
    df['time'] = pd.to_datetime(df['time'], format='%Y-%m-%d %H:%M:%S')
    df['time'] = df['time'].dt.strftime('%Y-%m-%d %H:%M:%S')
    data_tuples = [tuple(row) for row in df.to_numpy()]
    cursor.executemany(insert_query, data_tuples)
    conn.commit()
    cursor.close()
    return JSONResponse(content={"result": "successfully"})

@app.get("/system-log", response_model=dict, tags=["root"])
async def get_sytem_log(db=Depends(get_db)) -> dict:
    stmt = sa.select(SYSTEM_LOG)
    df = pd.DataFrame(db.execute(stmt).fetchall())
    if len(df) > 0:
        df = df.drop(columns=['id'])
        transform_timestamp(df,['created'])
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
                literal_column("'analyst'").label('role')
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
        'disease-note': 'disease_note'
    }
    action = {
        'self-note':'insert self note',
        'patient-note': 'insert patient note',
        'user-note': 'insert user note',
        'disease-note': 'insert disease note'
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
        'disease-note': 'disease_note'
    }
        action = {
            'self-note':'update self note',
            'patient-note': 'update patient note',
            'user-note': 'update user note',
            'disease-note': 'update disease note'
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
        'disease-note': 'disease_note'
    }
        action = {
            'self-note':'delete self note',
            'patient-note': 'delete patient note',
            'user-note': 'delete user note',
            'disease-note': 'delete disease note'

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
    
@app.get("/disease-notes", response_model=dict, tags=["root"]) 
async def get_disease_notes(user_code,disease_code ,db=Depends(get_db)) -> dict:
    # subject_id = int(subject_id)
    # print(subject_id)
    # doctor_code = int(doctor_code)
    stmt = DISEASE_NOTE.select().where(sa.and_(DISEASE_NOTE.columns.user_code == user_code, DISEASE_NOTE.columns.disease_code == disease_code, 
                                               DISEASE_NOTE.columns.active == True ))\
        .order_by(sa.desc(DISEASE_NOTE.columns.updated_at))
    
    df = pd.DataFrame(db.execute(stmt).fetchall())

    if len(df)>0:
        transform_timestamp(df,['created_at','updated_at'])
        result = df.to_dict(orient='records')
        # print(result)
    else:
        result = []
    # print(result)
    return JSONResponse(content={"note": result})

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
    if result == None:
        result = 1
    df['id'] = result
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
    stmt = LOAD_DATA_MANUAL.select()
    df = pd.DataFrame(db.execute(stmt).fetchall())

    if len(df)>0:
        transform_timestamp(df,['created_at'])
        result = df.to_dict(orient='records')
        # print(result)
    else:
        result = []
    # print(result)
    return JSONResponse(content={"load_data_manual_history": result})

@app.get("/files-system", response_model=dict, tags=["root"]) 
async def get_files(db=Depends(get_db)) -> dict:
    stmt = FILES.select()
    df = pd.DataFrame(db.execute(stmt).fetchall())
    df_general = df[(df['active'] == 1) & (df['type_file'] == 'Model')]
    df_general['type_model'] = df_general['metadata'].apply(lambda x: x.split('Type of Model: ')[1])
    df_general = df_general[['type_of_disease','type_model']]
    df_general.columns = ['disease','name']
    if len(df)>0:
        transform_timestamp(df,['created_at','updated_at','last_access_time'])
        result = df.to_dict(orient='records')
        genderal_result = df_general.to_dict(orient='records')

        # print(result)
    else:
        result = []
    # print(result)
    return JSONResponse(content={"file": result, 'general': genderal_result})

@app.post("/update-file-location", response_model=dict, tags=["root"])
async def update_file_location(data: dict,db=Depends(get_db)) -> dict:
    print(data)
    df = pd.DataFrame([data])

    print(df)
    columns = df.columns

    insert_query_hive = f"""
        INSERT INTO TABLE files ({', '.join([f'`{col}`' for col in columns])})
        VALUES ({', '.join(['%s' for _ in range(len(columns))])})
        """
    
    insert_query_mysql = f"""
        INSERT INTO  files ({', '.join([f'`{col}`' for col in columns])})
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

    update_query = f"""UPDATE files SET active = 0 WHERE code = %s"""
    cursor.execute(update_query, (data['code'],))
    conn.commit()
    
    cursor.executemany(insert_query, data_tuples)
    conn.commit()
    
    cursor.close()
    conn.close()
    return {"message": "Loading Data Manually successfully"}

@app.post("/retrain-model", response_model=dict, tags=["root"])
async def retrain_model(data: dict, db=Depends(get_db)) -> dict:
    print(data)
    # data['schedule'] = datetime.datetime.strptime(data['schedule'] , '%Y-%m-%dT%H:%M:%S.%fZ')
    # data['created_at'] = data['created_at'].strftime('%Y-%m-%d %H:%M:%S')

    df = pd.DataFrame([data])
    
    columns = df.columns
    df['schedule'] = pd.to_datetime(df['schedule'])
    df['schedule'] = df['schedule'].dt.strftime('%Y-%m-%d %H:%M:%S')
    print(df)

    insert_query_hive = f"""
        INSERT INTO TABLE model_schedule ({', '.join([f'`{col}`' for col in columns])})
        VALUES ({', '.join(['%s' for _ in range(len(columns))])})
        """
    
    insert_query_mysql = f"""
        INSERT INTO  model_schedule ({', '.join([f'`{col}`' for col in columns])})
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
    
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Loading Data Manually successfully"}


@app.get("/get-training-data", response_model=dict, tags=["root"])
async def get_training_data(disease, db=Depends(get_db)) -> dict:
    # disease = 'Alcohol Abuse'
    hadm_id_list = sa.select(sa.distinct(ANNOTATE.columns.hadm_id)).as_scalar()
    label = sa.select(
        ANNOTATE.columns.hadm_id,
        ANNOTATE.columns.disease_code,
        sa.func.max(ANNOTATE.columns.time).label('max_time')
    ). select_from(sa.join(ANNOTATE,DISEASE,ANNOTATE.c.disease_code == DISEASE.c.disease_code ))\
    .where(DISEASE.c.name == disease) \
    .group_by(
        ANNOTATE.columns.disease_code,
        ANNOTATE.columns.hadm_id,
    ).alias('label')
    
    stmt = sa.select(
        ANNOTATE.columns.hadm_id,
        ANNOTATE.columns.disease_code,
        ANNOTATE.columns.value,
    ) \
    .select_from(ANNOTATE) \
    .join(
        label,
        sa.and_(
            ANNOTATE.columns.disease_code == label.c.disease_code,
            ANNOTATE.columns.hadm_id == label.c.hadm_id,
            ANNOTATE.columns.time == label.c.max_time
        )
    )
    
    df_annotate = pd.DataFrame(db.execute(stmt).fetchall())
    print(df_annotate)
    stmt = NOTEEVENTS.select() \
    .select_from(NOTEEVENTS) \
    .where(
        sa.and_(
            NOTEEVENTS.c.category == 'Discharge summary',
            NOTEEVENTS.c.hadm_id.in_(hadm_id_list),
        )
    )
   
    df_note = pd.DataFrame(db.execute(stmt).fetchall())
    if len(df_note)>0:
        df = pd.merge(df_annotate,df_note, how="inner", on=["hadm_id","hadm_id"])

        df = df[['hadm_id','text','value']]
        print(df)
        result = df.to_dict(orient='records')
    else:
        result = []
    return JSONResponse(content={"training_data":result})





    
    

    




            
            





    
    

