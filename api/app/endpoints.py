from fastapi import APIRouter

from app.bdd import query

router = APIRouter()

@router.get("/tables")
async def get_tables():
    return query.get_all_tables()

@router.get("/producers/all")
async def get_producers():
    return query.get_all_producers()

@router.get("/producers/{producer_name}")
async def get_producer(producer_name: str):
    return query.get_producer(producer_name)

@router.get("/coords/all")
async def get_coords():
    return query.get_all_coords_gps()

@router.get("/coords/{producer_id}")
async def get_coords(producer_id: int):
    return query.get_coords_gps(producer_id)

