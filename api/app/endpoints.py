from fastapi import APIRouter
from fastapi import HTTPException

from app.bdd import query

router = APIRouter()

@router.get("/tables")
async def get_tables():
    return query.get_all_tables()

@router.get("/producers/all")
async def get_producers():
    producers = query.get_all_producers()
    
    if producers is None:
        producers = []

    return producers

@router.get("/producers/name/{producer_name}")
async def get_producer_by_name(producer_name: str):
    producer = query.get_producer_by_name(name = producer_name)

    if producer is None:
        raise HTTPException(status_code=404, detail=f"Producer({producer_name}) not found")

    return producer

@router.get("/coords/all")
async def get_coords():
    coords = query.get_all_coords_gps()
    
    if coords is None:
        coords = []

    return coords


@router.get("/coords/{producer_id}")
async def get_coords_by_id(producer_id: int):
    coords = query.get_coords_gps_by_producer_id(producer_id = producer_id)
    
    if coords is None:
        raise HTTPException(status_code=404, detail=f"Coords of producer({producer_id} not found")

    return coords


@router.get("/producers/id/{producer_uid}")
async def get_producer_by_uid(producer_uid: int):
    producer = query.get_producer_by_id(id = producer_uid)

    if producer is None:
        raise HTTPException(status_code=404, detail=f"Producer({producer_uid}) not found")

    return producer


from pydantic import BaseModel
class ProducerInput(BaseModel):
    name: str

@router.post("/producers/add")
async def add_producer(producer: ProducerInput):
    output = None
    try:
        output = query.create_producer(name = producer.name)
        query._conn.commit()
    except Exception as e:
        return {"error": str(e)}

    return output


@router.get("/ping")
async def ping():
    return {"ping": "pong"}
                        
