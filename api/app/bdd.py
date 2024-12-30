
# sqlalchemy
from sqlalchemy import create_engine

# database
from orm.query import Querier

from dotenv import load_dotenv
import os

# load environment variables
load_dotenv()

# get the database url
DATABASE_URL = os.getenv("BDD_URL")
# DATABASE_URL = "postgresql://root:toor@localhost:5432/gps_tracker"

if not DATABASE_URL:
    raise HTTPException(status_code=500, detail="Database URL not found.")

# connect to the database
postgres_db = create_engine(DATABASE_URL)
conn = postgres_db.connect()

# check if connection is successful
if not conn:
    raise HTTPException(status_code=500, detail="Database connection failed.")

# create a querier object
query = Querier(conn)


if __name__ == "__main__":
    print("Connected to the database.")
    print("Database URL: ", DATABASE_URL)
    print("Database connection: ", conn)
    print("Querier object: ", query)
    
    print(list(query.get_all_coords_gps()))
