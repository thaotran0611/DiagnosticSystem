import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.api_admin:app", host="0.0.0.0", port=8004, reload=True)