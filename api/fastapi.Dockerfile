FROM python:3.13.0-slim

WORKDIR /code

COPY requirements.txt .
COPY . .


RUN pip install --no-cache-dir -r requirements.txt


EXPOSE $FAST_API_PORT
