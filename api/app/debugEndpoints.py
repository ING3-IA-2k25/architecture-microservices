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
    output = None
    try:
        output = query.create_producer(name = producer.name)
        query._conn.commit()
    except Exception as e:
        return {"error": str(e)}

    return output

@router.post("/coords")
async def get_coords(coords: CoordsInput):
    output = None
    try:
        output = query.create_coords_gps(producer_id=coords.producer_id, uid=coords.uid, latitude=coords.latitude, longitude=coords.longitude)
        query._conn.commit()
    except Exception as e:
        query._conn.rollback()
        return {"error": str(e)}

    return output
    