from fastapi import APIRouter

from app.bdd import query

router = APIRouter()

@router.get("/tables")
async def get_tables():
    return query.get_all_tables()

@router.get("/producers/all")
async def get_producers():
    return query.get_all_producers()

@router.get("/producers/name/{producer_name}")
async def get_producer_by_name(producer_name: str):
    return query.get_producer_by_name(name = producer_name)

@router.get("/coords/all")
async def get_coords():
    return query.get_all_coords_gps()

@router.get("/coords/{producer_id}")
async def get_coords_by_id(producer_id: int):
    return query.get_coords_gps_by_producer_id(producer_id = producer_id)

@router.get("/producers/id/{producer_uid}")
async def get_producer_by_uid(producer_uid: int):
    print("Querying producer by id")
    return query.get_producer_by_id(id = producer_uid)



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


