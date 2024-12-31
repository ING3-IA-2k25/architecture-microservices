# architecture-microservices

## Dependencies

You need to have installed on your machine :
- docker
- docker-compose

You need to have the following ports available :
- 80 (for the app)
- 15432 (for pgadmin #optional)
- 5432 (for postgres)
- 9092 (for kafka)
- 7000 (for the api)

## Setup the project with docker compose

run the command :
```sh
docker compose up -d
```

## Create a producer

### create with docker 
run the following command to build the producer image :
```sh
docker build -t producer -f producer.Dockerfile .
```

run the following command to run the producer container :
```sh
docker run --network architecture-microservices_app-network -t producer
```

if you want to customize the username of the producer, you can run the following command :
```sh
docker run -e KAFKA_USERNAME="USERNAME" --network architecture-microservices_app-network -t pro
```

if you want to change the IP of the kafka server, you can run the following command :
(not the best name for an environment variable, I agree)
```sh
docker run -e KAFKA_CONTAINER_NAME="IP" --network architecture-microservices_app-network -t producer
```

### create manually

run the following command to install the dependencies :
```sh
pip install -r kafka/requirements.txt
```

run the following command to run the producer :
```sh
python kafka/producer.py
```

if you want to customize the username of the producer, you can run the following command :
```sh
python kafka/producer.py $KAFKA_USERNAME
```


## Create a consumer

### create with docker
run the following command to build the consumer image :
```sh
docker build -t consumer -f consumer.Dockerfile .
```

run the following command to run the consumer container :
```sh
docker run --network architecture-microservices_app-network -t consumer
```

if you want to change the IP of the kafka server, you can run the following command :
(not the best name for an environment variable, I agree)
```sh
docker run -e KAFKA_CONTAINER_NAME="IP" --network architecture-microservices_app-network -t consumer
```

### create manually

run the following command to install the dependencies :
```sh
pip install -r kafka/requirements.txt
```

run the following command to run the consumer :
```sh
python kafka/consumer.py
```


## Connect to the app

go to (app)[http://localhost:80]

it's possible that the connection to the api failed, just refresh the page <C-r>

### option available

- click on user name to focus on him
- user online if we receive a message from him in the last 5 seconds
- select user to see/hide their tracks

### setup pgadmin to check the database

go to (pgadmin)[http://localhost:15432]

login and password are in .env file
as default, they are :
- login : admin@pgadmin.com
- password : root

>>> add New server
>>> hostname : postgres_AM (name of the docker)
>>> username : root (from the .env file)
>>> password : toor (from the .env file)

