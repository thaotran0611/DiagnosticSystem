from fastapi import FastAPI, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from database import engine, get_db
from construct import * 
import sqlalchemy as sa
import pandas as pd
import json

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


# Session = sa.orm.sessionmaker(engine)
# session = Session()

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your todo list."}

@app.get("/doctor", response_model=dict, tags=["root"])  # test connect
async def get_doctor(db=Depends(get_db)) -> dict:
    try:
        # Execute the query
        query = DOCTOR.select()
        # Fetch the results
        result = db.execute(query).fetchall()
        data = pd.DataFrame(result)
        print(data)
        #convert to dictionary
        doctors = data.to_dict(orient='records')
        
        # Return the list of dictionaries as JSON response
        return JSONResponse(content={"doctors": doctors})      

    except Exception as e:
        # Log the exception for debugging
        print(f"An error occurred: {e}")
        # Return an error response
        return {"error": "An internal server error occurred"}
