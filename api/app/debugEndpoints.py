from fastapi import APIRouter
from pydantic import BaseModel


class ProducerInput(BaseModel):
    name: str


from app.bdd import query

router = APIRouter()

@router.post("/producers")
async def get_producers(producer: ProducerInput):
    return query.create_producer(name=producer.name)

