from database import engine
import sqlalchemy as sa

metadata = sa.MetaData()
metadata.reflect(bind=engine)

#add 1 table for the number of patients a doctor need to visit each day

USER = sa.Table('users', metadata, autoload=True, autoload_with=engine)  
DOCTOR = sa.Table('doctor', metadata, autoload=True, autoload_with=engine) 
ADMINISTRATOR = sa.Table('aministrator', metadata, autoload=True, autoload_with=engine)  
ANALYST = sa.Table('analyst', metadata, autoload=True, autoload_with=engine) 
RESEARCHER = sa.Table('researcher', metadata, autoload=True, autoload_with=engine)  
ACTION = sa.Table('action', metadata, autoload=True, autoload_with=engine)  
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
DO_D_ITEMS = sa.Table('do_d_items', metadata, autoload=True, autoload_with=engine) 
DO_D_LABITEMS = sa.Table('do_d_labitems', metadata, autoload=True, autoload_with=engine)  
DRUG = sa.Table('drug', metadata, autoload=True, autoload_with=engine)  
GET_DATE_SCHEDULE = sa.Table('get_date_schedule', metadata, autoload=True, autoload_with=engine)   
GRANTED = sa.Table('granted', metadata, autoload=True, autoload_with=engine)  
LOG = sa.Table('log', metadata, autoload=True, autoload_with=engine) 
MODEL_FILE_SCHEDULE = sa.Table('model_file_schedule', metadata, autoload=True, autoload_with=engine)  
NOTE = sa.Table('note', metadata, autoload=True, autoload_with=engine) 
NOTEEVENTS = sa.Table('noteevents', metadata, autoload=True, autoload_with=engine) 
PATIENT_NOTE = sa.Table('patient_note', metadata, autoload=True, autoload_with=engine)  
PATIENTS_CHECKED = sa.Table('patients_checked', metadata, autoload=True, autoload_with=engine) 
PRESCRIPTIONS = sa.Table('prescriptions', metadata, autoload=True, autoload_with=engine) 
RETRAIN_SCHEDULE = sa.Table('retrain_schedule', metadata, autoload=True, autoload_with=engine)  


