from fastapi import WebSocket, APIRouter
from app.bdd import query
import asyncio

router = APIRouter()

class SockerManager:
    def __init__(self):
        self.consumer_websockets = []
        self.front_websockets = []

    async def connect_consumer(self, websocket: WebSocket):
        await websocket.accept()
        self.consumer_websockets.append(websocket)
        return websocket

    async def connect_front(self, websocket: WebSocket):
        await websocket.accept()
        self.front_websockets.append(websocket)


    async def keep_alive(self, msg: str):
        print("keep alive loop")
        for connection in self.consumer_websockets:
            await connection.send_text(msg)

        await asyncio.sleep(10)
        await self.keep_alive(msg)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.consumer_websockets:
            self.consumer_websockets.remove(websocket)
            print("Consumer websocket disconnected")
            return
    
        if websocket in self.front_websockets:
            self.front_websockets.remove(websocket)
            print("Front websocket disconnected")
            return

        raise Exception("Websocket not found")



    async def broadcast_to_front(self, message: str):
        err = None
        
        if len(self.front_websockets) != 0:
            print(f"Broadcasting to {len(self.front_websockets)} front websockets")

        for connection in self.front_websockets:
            try:
                await connection.send_text(message)
            except Exception as e:
                err = str(e)
                continue

        return err



    async def receive_from_consumer(self, websocket: WebSocket):
        data = await websocket.receive_text()
        print("sending OK to keepalive")
        await websocket.send_text("OK")
        await self.broadcast_to_front(data)


manager = SockerManager()
# keep_alive_task = asyncio.create_task(manager.keep_alive("Keep alive"))

# create socket for kafka
@router.websocket("/ws/consumer")
async def websocket_endpoint_consumer(websocket: WebSocket):
    await manager.connect_consumer(websocket)
    print("WS/consumer : Connected to websocket")
    
    tasks = []

    while websocket.client_state != 3:
        # get data from kafka
        try:
            data = await websocket.receive_text()
            await websocket.send_text("OK") 
            # print data 
            print(f"DEBUG : Received data: {data}")
            uid, lat, lon = data.split(",")
            lat = float(lat)
            lon = float(lon)

            # send data to postgre
            # TODO : change to async queries
            query.create_coords_gps(producer_id = uid, latitude = lat, longitude = lon)
            query._conn.commit()

            
            # broadcast data to front asynchronusly
            task = asyncio.create_task(manager.broadcast_to_front(data))
            tasks.append(task)
            task.add_done_callback(lambda x: tasks.remove(x))
            

        except Exception as e:
            print(f"Error: {str(e)}")
            break

    manager.disconnect(websocket)
    

@router.websocket("/ws/front")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect_front(websocket)
    print("WS/front : Connected to websocket")

    # while websocket is alive, don't disconnect
    while websocket.client_state != 3:
        try:
            # to keep the connection alive
            await websocket.receive_text()
            print("WS/front : Received data")

        except Exception as e:
            print(f"Error: {str(e)}")
            break

    manager.disconnect(websocket)
    print("WS/front : Disconnected from websocket")

