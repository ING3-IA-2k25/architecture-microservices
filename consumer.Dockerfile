FROM python:3.13.0-slim

WORKDIR /code

COPY kafka/requirements.txt . 
RUN pip install --no-cache-dir -r requirements.txt

COPY ./kafka/consumer2.py . 
COPY .env .


ENTRYPOINT python consumer2.py 
