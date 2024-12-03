
# sqlalchemy
from sqlalchemy import create_engine

# database
from orm.query import Querier


# connect to the database
postgres_db = create_engine("postgresql://root:toor@localhost:5432/gps_tracker")
conn = postgres_db.connect()

# check if connection is successful
if not conn:
    raise HTTPException(status_code=500, detail="Database connection failed.")

# create a querier object
query = Querier(conn)
    