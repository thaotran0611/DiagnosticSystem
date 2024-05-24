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

@app.get("/files-system", response_model=dict, tags=["root"]) 
async def get_files(db=Depends(get_db)) -> dict:
    stmt = FILES.select()
    df = pd.DataFrame(db.execute(stmt).fetchall()).drop(columns=['code'])
    df_general = df[(df['active'] == 1) & (df['type_file'] == 'Model')]
    df_general['type_model'] = df_general['metadata'].apply(lambda x: x.split('Type of Model: ')[1])
    df_general = df_general[['type_of_disease','type_model']]
    df_general.columns = ['disease','name']
    if len(df)>0:

        df.fillna(value=np.nan, inplace=True)
        df.replace({np.nan: None}, inplace=True)
        transform_timestamp(df,['created_at','updated_at','last_access_time'])
        # df.columns = mapping_column(df.columns)
        result = df.to_dict(orient='records')
        genderal_result = df_general.to_dict(orient='records')
    else:
        result = []
    return JSONResponse(content={"file": result, 'general': genderal_result})

# @app.post("/update-file-location", response_model=dict, tags=["root"])
# async def update_file_location(data: dict,db=Depends(get_db)) -> dict:
#     print(data)
#     df = pd.DataFrame([data])

#     print(df)
#     columns = df.columns

#     insert_query_hive = f"""
#         INSERT INTO TABLE files ({', '.join([f'`{col}`' for col in columns])})
#         VALUES ({', '.join(['%s' for _ in range(len(columns))])})
#         """
    
#     insert_query_mysql = f"""
#         INSERT INTO  files ({', '.join([f'`{col}`' for col in columns])})
#         VALUES ({', '.join(['%s' for _ in range(len(columns))])})
#         """    
    
#     if select_db == 'hive':
#         insert_query = insert_query_hive
#         conn = hive.connect(host='localhost', port=10000, database='mimic_iii')
#     else:
#         insert_query = insert_query_mysql
#         engine = create_engine(SQLALCHEMY_DATABASE_URL_MYSQL) 
#         conn = engine.connect().connection
    
#     cursor = conn.cursor()
    
#     data_tuples = [tuple(row) for row in df.to_numpy()]

#     update_query = f"""UPDATE files SET active = 0 WHERE code = %s"""
#     cursor.execute(update_query, (data['code'],))
#     conn.commit()
    
#     cursor.executemany(insert_query, data_tuples)
#     conn.commit()
    
#     cursor.close()
#     conn.close()
#     return {"message": "Loading Data Manually successfully"}

# @app.post("/retrain-model", response_model=dict, tags=["root"])
# async def retrain_model(data: dict, db=Depends(get_db)) -> dict:
#     print(data)
#     # data['schedule'] = datetime.datetime.strptime(data['schedule'] , '%Y-%m-%dT%H:%M:%S.%fZ')
#     # data['created_at'] = data['created_at'].strftime('%Y-%m-%d %H:%M:%S')

#     df = pd.DataFrame([data])
    
#     columns = df.columns
#     df['schedule'] = pd.to_datetime(df['schedule'])
#     df['schedule'] = df['schedule'].dt.strftime('%Y-%m-%d %H:%M:%S')
#     print(df)

#     insert_query_hive = f"""
#         INSERT INTO TABLE model_schedule ({', '.join([f'`{col}`' for col in columns])})
#         VALUES ({', '.join(['%s' for _ in range(len(columns))])})
#         """
    
#     insert_query_mysql = f"""
#         INSERT INTO  model_schedule ({', '.join([f'`{col}`' for col in columns])})
#         VALUES ({', '.join(['%s' for _ in range(len(columns))])})
#         """    
    
#     if select_db == 'hive':
#         insert_query = insert_query_hive
#         conn = hive.connect(host='localhost', port=10000, database='mimic_iii')
#     else:
#         insert_query = insert_query_mysql
#         engine = create_engine(SQLALCHEMY_DATABASE_URL_MYSQL) 
#         conn = engine.connect().connection
    
#     cursor = conn.cursor()
    
#     data_tuples = [tuple(row) for row in df.to_numpy()]

#     cursor.executemany(insert_query, data_tuples)
#     conn.commit()
    
#     conn.commit()
#     cursor.close()
#     conn.close()
#     return {"message": "Loading Data Manually successfully"}


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
        ANNOTATE.columns.value.label('label'),
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

        df = df[['hadm_id','text','label']]
        print(df)
        df.columns = mapping_column(df.columns)
        result = df.to_dict(orient='records')
    else:
        result = []
    return JSONResponse(content={"training_data":result})





    
    

    




            
            





    
    

