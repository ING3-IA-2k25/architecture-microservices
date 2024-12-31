import sys
import struct
from kafka.vendor import six
from kafka import KafkaConsumer
import asyncio
import websockets
import threading
import json
import logging
import httpx
import requests
import dotenv
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


"""
create a websocket connection to the FastAPI server
"""
async def connect_to_websocket(URL):
    return await websockets.connect(URL)


"""
does everything the consumer should do
"""
async def main():
    API_URL = os.getenv("FASTAPI_URL", "localhost:7000")
    API_URL = API_URL.split("http://")[-1]
    logger.info(f"Using FastAPI URL: {API_URL}")


    # try to ping the fastapi server
    try:
        response = requests.get(f"http://{API_URL}/ping")
        logger.info(response.text)
    except requests.exceptions.ConnectionError:
        # try with localhost
        API_URL = "localhost:7000"
        try:
            response = requests.get(f"http://{API_URL}/ping")
            logger.info(response.text)
        except requests.exceptions.ConnectionError:
            logger.error("Could not connect to the FastAPI server")
            sys.exit(1)

    # make async request to get all producers
    async with httpx.AsyncClient() as client:
        response = await client.get(f'http://{API_URL}/api/producers/all')
        producers = response.json()
        producers_dict = {prod["name"]: prod["id"] for prod in producers}
        logger.info(producers_dict)


    # create a websocket connection
    print("trying to connect to websocket: ", f"ws://{API_URL}/ws/consumer")
    async with websockets.connect(f"ws://{API_URL}/ws/consumer") as ws:
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
                response = requests.post(f"http://{API_URL}/api/producers/add", json={"name": name})
                prod = json.loads(response.text)

                producers_dict[name] = prod["id"]

            try:
                # send the data to the fastapi server
                await ws.send(f"{producers_dict[name]},{f1},{f2}")
            except websockets.exceptions.ConnectionClosedError:
                logger.error("Connection to the websocket server was closed")

                # TODO: This should not happen or else should be handled better
                # create a new connection 
                ws = await connect_to_websocket(f"ws://{API_URL}/ws/consumer")

                try:
                    await ws.send(f"{producers_dict[name]},{f1},{f2}")
                except websockets.exceptions.ConnectionClosedError:
                    logger.error("Connection to the websocket server was closed 2 times in a row, ")
                    break


if __name__ == "__main__":
    dotenv.load_dotenv()

    server_name = os.getenv("KAFKA_CONTAINER_NAME", "localhost")
    server_port = os.getenv("KAFKA_CONTAINER_PORT", "9092")


    if sys.version_info >= (3, 12, 0):
        sys.modules['kafka.vendor.six.moves'] = six.moves
    
    try:
        # connect as docker
        print(f'trying to connect to {server_name}:{server_port}')
        consumer = KafkaConsumer('gps-coordonates', bootstrap_servers=f'{server_name}:{server_port}')
    except:
        # connect as localhost
        print(f'trying to connect to localhost:9092')
        try:
            consumer = KafkaConsumer('gps-coordonates', bootstrap_servers='localhost:9092')
        except:
            logger.error("Could not connect to the Kafka server")
            sys.exit(1)


    # consumer = KafkaConsumer('gps-coordonates', bootstrap_servers='localhost:9092')
    t = threading.Thread(target=asyncio.run(main()))
    t.start()
    t.join()
