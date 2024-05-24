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
        PATIENTS_CHECKED.columns.dod
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

@app.get("/detaildisease-clinical-sign", response_model=dict, tags=["root"])
async def detail_disease_clinical_sign(disease_code='AA', db=Depends(get_db)) -> dict:
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
        NOTEEVENTS.columns.charttime,
        NOTEEVENTS.c.category,
        NOTEEVENTS.c.text
        # (sa.func.extract('year', PATIENTS_CHECKED.columns.dod) - sa.func.extract('year', PATIENTS_CHECKED.columns.dob)).label('age_of_death')
    )\
    .select_from(sa.join(sa.join(sa.join(sa.join(subquery, DISEASE, subquery.columns.disease_code == DISEASE.columns.disease_code), ADMISSIONS_CHECKED, ADMISSIONS_CHECKED.columns.hadm_id == subquery.columns.hadm_id), PATIENTS_CHECKED, PATIENTS_CHECKED.columns.subject_id == ADMISSIONS_CHECKED.columns.subject_id),NOTEEVENTS, NOTEEVENTS.c.hadm_id == ADMISSIONS_CHECKED.c.hadm_id))\
    .where(subquery.columns.disease_code == disease_code) \
    .order_by(ADMISSIONS_CHECKED.columns.hadm_id)

    df = pd.DataFrame(db.execute(stmt).fetchall())
    if len(df)>0:
        transform_timestamp(df,['dob', 'dod', 'charttime'])
        result = df.to_dict(orient='records')
    else:
        result = []
    return JSONResponse(content={"clinicalsign": result})

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

@app.get("/medicine-notes", response_model=dict, tags=["root"]) 
async def get_medicine_notes(user_code,drug, drug_name_poe, drug_type, formulary_drug_cd ,db=Depends(get_db)) -> dict:

    stmt = DRUG_NOTE.select().where(sa.and_(DRUG_NOTE.columns.user_code == user_code
                                            , DRUG_NOTE.columns.drug == drug
                                            , DRUG_NOTE.columns.drug_name_poe == drug_name_poe
                                            , DRUG_NOTE.columns.drug_type == drug_type
                                            , DRUG_NOTE.columns.formulary_drug_cd == formulary_drug_cd
                                            ,DRUG_NOTE.columns.active == True ))\
        .order_by(sa.desc(DRUG_NOTE.columns.updated_at))
    
    df = pd.DataFrame(db.execute(stmt).fetchall())

    if len(df)>0:
        transform_timestamp(df,['created_at','updated_at'])
        result = df.to_dict(orient='records')
        # print(result)
    else:
        result = []
    # print(result)
    return JSONResponse(content={"note": result})
