from database import engine
import sqlalchemy as sa

metadata = sa.MetaData()
metadata.reflect(bind=engine)

#add 1 table for the number of patients a doctor need to visit each day

USERS = sa.Table('users', metadata, autoload=True, autoload_with=engine)  
DOCTOR = sa.Table('doctor', metadata, autoload=True, autoload_with=engine) 
ADMINISTRATOR = sa.Table('administrator', metadata, autoload=True, autoload_with=engine)  
ANALYST = sa.Table('analyst', metadata, autoload=True, autoload_with=engine) 
RESEARCHER = sa.Table('researcher', metadata, autoload=True, autoload_with=engine)  
ADMISSIONS_CHECKED = sa.Table('admissions_checked', metadata, autoload=True, autoload_with=engine) 
ANNOTATE = sa.Table('annotate', metadata, autoload=True, autoload_with=engine) 
CARE = sa.Table('care', metadata, autoload=True, autoload_with=engine)  
D_ICD_DIAGNOSES = sa.Table('d_icd_diagnoses', metadata, autoload=True, autoload_with=engine)  
D_ICD_PROCEDURE = sa.Table('d_icd_procedure', metadata, autoload=True, autoload_with=engine)   
D_ITEMS = sa.Table('d_items', metadata, autoload=True, autoload_with=engine) 
D_LABITEMS = sa.Table('d_labitems', metadata, autoload=True, autoload_with=engine)  
DISEASE = sa.Table('disease', metadata, autoload=True, autoload_with=engine)  
DO_D_ICD_DIAGNOSES = sa.Table('do_d_icd_diagnoses', metadata, autoload=True, autoload_with=engine)   
DO_D_ICD_PROCEDURE = sa.Table('do_d_icd_procedure', metadata, autoload=True, autoload_with=engine)   
# DO_D_ITEMS = sa.Table('do_d_items', metadata, autoload=True, autoload_with=engine) 
DO_D_LABITEMS = sa.Table('do_d_labitems', metadata, autoload=True, autoload_with=engine)  
DRUG = sa.Table('drug', metadata, autoload=True, autoload_with=engine)  
GET_DATE_SCHEDULE = sa.Table('get_date_schedule', metadata, autoload=True, autoload_with=engine)   
# LOG = sa.Table('log', metadata, autoload=True, autoload_with=engine) 
# MODEL_FILE_SCHEDULE = sa.Table('model_file_schedule', metadata, autoload=True, autoload_with=engine)  
# NOTE = sa.Table('note', metadata, autoload=True, autoload_with=engine) 
NOTE = sa.Table('transactional_note', metadata, autoload=True, autoload_with=engine) 
NOTEEVENTS = sa.Table('noteevents', metadata, autoload=True, autoload_with=engine) 
# PATIENT_NOTE = sa.Table('patient_note', metadata, autoload=True, autoload_with=engine)  
PATIENT_NOTE = sa.Table('transactional_patient_note', metadata, autoload=True, autoload_with=engine)  
PATIENTS_CHECKED = sa.Table('patients_checked', metadata, autoload=True, autoload_with=engine) 
PRESCRIPTIONS = sa.Table('prescriptions', metadata, autoload=True, autoload_with=engine) 
# RETRAIN_SCHEDULE = sa.Table('retrain_schedule', metadata, autoload=True, autoload_with=engine)  
PROCEDURE = sa.Table('procedureevents_mv', metadata, autoload=True, autoload_with=engine)  
SYSTEM_LOG = sa.Table('fastapi_logs', metadata, autoload=True, autoload_with=engine)  
USER_ACTION_LOG = sa.Table('user_action_log', metadata, autoload=True, autoload_with=engine)  
ADMIN_SCHEDULE = sa.Table('get_date_schedule', metadata, autoload=True, autoload_with=engine)  
USER_NOTE = sa.Table('users_note', metadata, autoload=True, autoload_with=engine)  
DISEASE_NOTE = sa.Table('disease_note', metadata, autoload=True, autoload_with=engine)  
LOAD_DATA_MANUAL = sa.Table('load_data_manual', metadata, autoload=True, autoload_with=engine)  
FILES = sa.Table('files', metadata, autoload=True, autoload_with=engine) 
# MODEL_SCHEDULE = sa.Table('model_schedule', metadata, autoload=True, autoload_with=engine)  
DRUG_NOTE = sa.Table('drug_note', metadata, autoload=True, autoload_with=engine)  

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
           'response_status_code':'Status Code',
           'request_method': 'Method',
           'request_url': 'URL',
           'request_path_parameters': 'Path Parameters',
           'request_query_params': 'Query Parameters',
           'timespan' : 'Time Span',
           'created': 'Created',
           'url': 'Location Store',
           'created_at': 'Created',
           'updated_at': 'Updated',
           'last_access_time': 'Last Access Time',
           'type_file': 'Type of File',
           'type_of_disease': 'Prediction Disease',
           'metadata': 'Metadata',
           'active': 'Active',
           'acc': 'Accuracy',
           'auc': 'AUC',
           'p': 'Precision',
           'r': 'Recall',
           'f1': 'F1-Score'
           }
    mapped_cols = [dic.get(column, column) for column in col]
    return mapped_cols
