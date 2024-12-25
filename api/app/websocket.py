from fastapi import FastAPI, WebSocket, APIRouter
from app.bdd import query

router = APIRouter()

# create socket for kafka
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Connected to websocket")
    while True:
        # get data from kafka
        try:
            data = await websocket.receive_text()
        
            # print data 
            print(f"Received data: {data}")
            uid, lat, lon = data.split(",")
            lat = float(lat)
            lon = float(lon)

            # send data to postgre
            query.create_coords_gps(producer_id = uid, latitude = lat, longitude = lon)
            query._conn.commit()
        except Exception as e:
            print(f"Error: {str(e)}")
            break

