import sys
import struct
from kafka.vendor import six
from kafka import KafkaConsumer
import asyncio
import websockets



"""
create connection with fastapi
"""
async def connect_to_websocket():
    uri = "ws://localhost:8000/ws"  # Assuming your FastAPI server is running on port 8000
    return await websockets.connect(uri)

## init the connection
ws = asyncio.run(connect_to_websocket())

# test the connection, TODO: remove this line
# asyncio.run(ws.send("Hello, WebSocket! nigaaa"))
#


"""
create connection with kafka
"""
if sys.version_info >= (3, 12, 0):
    sys.modules['kafka.vendor.six.moves'] = six.moves

consumer = KafkaConsumer('gps-coordonates', bootstrap_servers='localhost:9092')



# make http request to the fastapi server to get the list of producers
import requests
import json

producers = requests.get("http://localhost:8000/api/producers/all")
producers = json.loads(producers.text)

producers_dict = dict()

for prod in producers:
    producers_dict[prod["name"]] = prod["id"]

print(producers_dict)



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
    print(f"Name: {name}, f1: {f1}, f2: {f2}")
    
    # adding new producer
    if name not in producers_dict:
        print(f"Producer {name} not found in the database")
        # request to fastapi post method to add new producer
        reponse = requests.post("http://localhost:8000/api/producers/add", json={"name": name})
        prod = json.loads(reponse.text)

        print(prod)
        producers_dict[name] = prod["id"]
        print(producers_dict[prod["name"]])

    # send the data to the fastapi server 
    asyncio.run(ws.send(f"{producers_dict[name]},{f1},{f2}"))
    
