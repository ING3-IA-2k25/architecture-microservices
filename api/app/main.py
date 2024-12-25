from fastapi import FastAPI, WebSocket
from fastapi.exceptions import HTTPException

# import routes
from app.endpoints import router
from app.debugEndpoints import router as debug_router
from app.websocket import router as ws_router

# create a FastAPI instance
app = FastAPI()

# include routes
app.include_router(router, prefix="/api")

# include debug routes
app.include_router(debug_router, prefix="/api/debug")

# include websocket routes
app.include_router(ws_router)

