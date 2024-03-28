from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connect

app = FastAPI()
conn = connect()
cursor = conn.cursor()

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

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your todo list."}

@app.get("/doctor", tags=["root"]) #test connect
async def get_doctor() -> dict:
    query = 'select * from doctor'
    cursor.execute(query)
    result = cursor.fetchall()
    return {"Doctor": result}

