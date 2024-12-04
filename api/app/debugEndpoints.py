from fastapi import APIRouter
from pydantic import BaseModel


class ProducerInput(BaseModel):
    name: str

class CoordsInput(BaseModel):
    producer_id: int
    uid: int
    latitude: float
    longitude: float

from app.bdd import query

router = APIRouter()

@router.post("/producers")
async def get_producers(producer: ProducerInput):
    return query.create_producer(name=producer.name)

@router.post("/coords")
async def get_coords(coords: CoordsInput):
    return query.create_coords(producer_id=coords.producer_id, uid=coords.uid, latitude=coords.latitude, longitude=coords.longitude)