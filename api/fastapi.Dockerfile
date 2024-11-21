FROM python:3.13.0

WORKDIR /code

COPY requirements.txt .
COPY /app/ /code/app/

RUN pip install --no-cache-dir -r requirements.txt
 
EXPOSE 8000
