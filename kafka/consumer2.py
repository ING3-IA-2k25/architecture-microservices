import sys
import struct
from kafka.vendor import six
from kafka import KafkaConsumer
import asyncio
import websockets
import threading
import requests
import json
import logging
import httpx

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


"""
create a websocket connection to the FastAPI server
"""
async def connect_to_websocket():
    uri = "ws://localhost:8000/ws/consumer"  # Assuming your FastAPI server is running on port 8000
    return await websockets.connect(uri)


"""
does everything the consumer should do
"""
async def main():
    
    # make async request to get all producers
    async with httpx.AsyncClient() as client:
        response = await client.get('http://localhost:8000/api/producers/all')
        producers = response.json()
        producers_dict = {prod["name"]: prod["id"] for prod in producers}
        logger.info(producers_dict)


    # create a websocket connection
    async with websockets.connect("ws://localhost:8000/ws/consumer") as ws:
        logger.info("Connected to the websocket server")
        for msg in consumer:
            # the message buffer is "str" followed by "\x00" (null character)
            #      - and then 2 float of 32 bits
            index = 0
            for byte in msg.value:
                if byte == 0:
                    break
                index += 1

            name = msg.value[0:index].decode("utf-8")

            packed_float = msg.value[index+1:]
            f1, f2 = struct.unpack('ff', packed_float)
            logger.info(f"Name: {name}, f1: {f1}, f2: {f2}")

            # adding new producer
            if name not in producers_dict:
                logger.info(f"Producer {name} not found in the database")
                # request to fastapi post method to add new producer                    
                response = requests.post("http://localhost:8000/api/producers/add", json={"name": name})
                prod = json.loads(response.text)

                producers_dict[name] = prod["id"]

            try:
                # send the data to the fastapi server
                await ws.send(f"{producers_dict[name]},{f1},{f2}")
            except websockets.exceptions.ConnectionClosedError:
                logger.error("Connection to the websocket server was closed")

                # TODO: This should not happen or else should be handled better
                # create a new connection 
                ws = await connect_to_websocket()

                try:
                    await ws.send(f"{producers_dict[name]},{f1},{f2}")
                except websockets.exceptions.ConnectionClosedError:
                    logger.error("Connection to the websocket server was closed 2 times in a row, ")
                    break


if __name__ == "__main__":
    if sys.version_info >= (3, 12, 0):
        sys.modules['kafka.vendor.six.moves'] = six.moves

    consumer = KafkaConsumer('gps-coordonates', bootstrap_servers='localhost:9092')
    t = threading.Thread(target=asyncio.run(main()))
    t.start()
    t.join()
