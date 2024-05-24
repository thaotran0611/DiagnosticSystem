import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.api_analyst:app", host="0.0.0.0", port=8003, reload=True)