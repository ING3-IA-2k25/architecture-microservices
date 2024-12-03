from fastapi import FastAPI
from fastapi.exceptions import HTTPException

# import routes
from app.endpoints import router

# create a FastAPI instance
app = FastAPI()

# include routes
app.include_router(router, prefix="/api")