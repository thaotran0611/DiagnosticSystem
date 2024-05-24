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
app.add_middleware(BaseHTTPMiddleware, dispatch=db_logging)


# active_sessions = {"DOCTOR": {}, "RESEARCHER": {}, "ADMINISTRATOR": {}, "ANALYST": {}}

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


@app.get("/predict", response_model=dict, tags=["root"])
async def predict_disease(hadm_id, db=Depends(get_db)) -> dict:
    hadm_id = int(hadm_id)
    subq = sa.select(
        ADMISSIONS_CHECKED.columns.hadm_id
    ).select_from(ADMISSIONS_CHECKED) \
    .where(sa.and_(
        ADMISSIONS_CHECKED.columns.subject_id == sa.select(ADMISSIONS_CHECKED.columns.subject_id)
            .where(ADMISSIONS_CHECKED.columns.hadm_id == hadm_id),
        ADMISSIONS_CHECKED.columns.admittime < sa.select(ADMISSIONS_CHECKED.columns.admittime)
            .where(ADMISSIONS_CHECKED.columns.hadm_id == hadm_id)
    )) \
    .order_by(ADMISSIONS_CHECKED.columns.admittime.desc()) \
    .limit(1) 

    df = pd.DataFrame(db.execute(subq).fetchall())
    if len(df) == 0:
        return JSONResponse(content={"message": 'This is the first admission. There is no historical discharge summary'})

    print("*********",df)
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
    




            
            





    
    

