from fastapi import FastAPI
from fastapi.exceptions import HTTPException

# import routes
from app.endpoints import router
from app.debugEndpoints import router as debug_router
# create a FastAPI instance
app = FastAPI()

# include routes
app.include_router(router, prefix="/api")

# include debug routes
app.include_router(debug_router, prefix="/api/debug")