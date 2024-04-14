from fastapi import FastAPI, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from database import engine, get_db
from construct import * 
import sqlalchemy as sa
import pandas as pd
import json
import random
import string
from pyhive import hive

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

def transform_timestamp(df,col_list):
    for col in col_list:
        df[col] = df[col].apply(lambda x: x.strftime('%Y-%m-%d %H:%M:%S') if x is not None else None)

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
    print(response[0])
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
    max_admittime = sa.func.max(ADMISSIONS_CHECKED.columns.admittime).label("max_admittime")
    subq = sa.select([
        CARE.columns.hadm_id,
        CARE.columns.charge_of
        ]) \
        .where(CARE.columns.doctor_code == doctor_code).subquery()
    
    subq_hadm_ids = sa.select([subq.columns.hadm_id]).as_scalar()

    subq2 = sa.select([
            PATIENTS_CHECKED.columns.subject_id,
            PATIENTS_CHECKED.columns.name,
            PATIENTS_CHECKED.columns.gender,
            PATIENTS_CHECKED.columns.dob,
            max_admittime
        ]).select_from(
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
    if len(df)>0:
        transform_timestamp(df,['admittime','dischtime','dob'])
        result = df.to_dict(orient='records')
        print(result)
    else:
        result = []
    return JSONResponse(content={"data": result})

@app.get("/patients-overview", response_model=dict, tags=["root"])  
async def get_patients_overview(doctor_code, db=Depends(get_db)) -> dict: #care x adminssion x patient
    max_admittime = sa.func.max(ADMISSIONS_CHECKED.columns.admittime).label("max_admittime")
    subq = sa.select([
        CARE.columns.hadm_id,
        CARE.columns.charge_of
        ]) \
        .where(CARE.columns.doctor_code == doctor_code).subquery()
    
    subq_hadm_ids = sa.select([subq.columns.hadm_id]).as_scalar()

    subq2 = sa.select([
            PATIENTS_CHECKED.columns.subject_id,
            PATIENTS_CHECKED.columns.name,
            PATIENTS_CHECKED.columns.gender,
            PATIENTS_CHECKED.columns.dob,
            max_admittime
        ]).select_from(
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
    if len(df)>0:
        transform_timestamp(df,['admittime','dischtime','dob'])
        result = df.to_dict(orient='records')
        print(result)
    else:
        result = []
    return JSONResponse(content={"data": result})

@app.post("/insert-self-note", tags=["root"])
async def insert_self_note(data:dict, db=Depends(get_db)) -> dict:
    print(data)
    note_id = generate_random_string(random.randint(4, 9))
    priority = data.get("priority")
    title = data.get("title")
    content = data.get("content")
    created_at = data.get("created_at")
    user_code = data.get("user_code")
    # Establish connection to Hive
    conn = hive.connect(host='localhost', port=10000, database='mimic_iii')
    # Create cursor
    cursor = conn.cursor()
    insert_query = """INSERT INTO TABLE note VALUES (%s, %s, %s, %s, %s, %s, %s,%s)"""
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

@app.post("/insert-patient-note", tags=["root"])
async def insert_self_note(data:dict, db=Depends(get_db)) -> dict:
    print(data)
    # note_id = generate_random_string(random.randint(4, 9))
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
    insert_query = """INSERT INTO TABLE patient_note VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    # Define data to be inserted
    data = (user_code,subject_id, created_at, created_at, content, priority, title)

    # Execute INSERT statement
    cursor.execute(insert_query, data)

    # Commit transaction
    conn.commit()

    # Close cursor and connection
    cursor.close()
    conn.close()

    return {"message": "Note inserted successfully"}

@app.post("/delete-self-note", tags=["root"])
async def delete_self_note(data:dict, db=Depends(get_db)) -> dict:
    print(data)
    note_id = data.get("note_id")
    
    # Establish connection to Hive
    conn = hive.connect(host='localhost', port=10000, database='mimic_iii')
    # Create cursor
    cursor = conn.cursor()
    query = f"""DELETE FROM note where note_id={note_id}"""
    # Execute INSERT statement
    cursor.execute(query)

    # Commit transaction
    conn.commit()

    # Close cursor and connection
    cursor.close()
    conn.close()

    return {"message": "Note inserted successfully"}

@app.get("/self-notes", response_model=dict, tags=["root"]) 
async def get_self_note(doctor_code, db=Depends(get_db)) -> dict:
    stmt = NOTE.select().where(sa.and_(NOTE.columns.user_code == doctor_code, NOTE.columns.active == True)).order_by(sa.desc(NOTE.columns.updated_at))
    df = pd.DataFrame(db.execute(stmt).fetchall())
    if len(df)>0:
        transform_timestamp(df,['created_at','updated_at'])
        result = df.to_dict(orient='records')
        print(result)
    else:
        result = []
    return JSONResponse(content={"data": result})

@app.get("/patient-notes", response_model=dict, tags=["root"]) 
async def get_patient_notes(doctor_code,subject_id ,db=Depends(get_db)) -> dict:
    subject_id = int(subject_id)
    doctor_code = int(doctor_code)
    stmt = PATIENT_NOTE.select().where(sa.and_(PATIENT_NOTE.columns.doctor_code == doctor_code, PATIENT_NOTE.columns.subject_id))\
        .order_by(sa.desc(PATIENT_NOTE.columns.updated_at))
    
    df = pd.DataFrame(db.execute(stmt).fetchall())
    print(df)

    if len(df)>0:
        transform_timestamp(df,['created_at','updated_at'])
        result = df.to_dict(orient='records')
        print(result)
    else:
        result = []
    print(result)
    return JSONResponse(content={"note": result})


@app.get("/patients-detail-admission", response_model=dict, tags=["root"])  
async def get_patients_admission_overview(doctor_code, subject_id, db=Depends(get_db)) -> dict:
    subject_id = int(subject_id)

    max_admittime = sa.func.max(ADMISSIONS_CHECKED.columns.admittime).label("max_admittime")
    
    subq = sa.select([
        ADMISSIONS_CHECKED.columns.subject_id,
        max_admittime
    ])\
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

    if len(df1)>0:
        transform_timestamp(df1,['admittime','dischtime'])
        result1 = df1.to_dict(orient='records')
        
    print(result1)
    
    return JSONResponse(content={"admission": result1})

@app.get("/patients-detail-overview", response_model=dict, tags=["root"])  
async def get_patients_detail_overview(doctor_code, subject_id, db=Depends(get_db)) -> dict:
    subject_id = int(subject_id)
    
    stmt2 = PATIENTS_CHECKED.select().where(PATIENTS_CHECKED.columns.subject_id == subject_id)

    df2 = pd.DataFrame(db.execute(stmt2).fetchall())
    print(df2)
    if len(df2)>0:
        transform_timestamp(df2,['dob','dod','dod_hosp','dod_ssn'])
        result2 = df2.to_dict(orient='records')
        
    print(result2)
    
    return JSONResponse(content={"patientDetail": result2})
