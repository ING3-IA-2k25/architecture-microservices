DROP DATABASE IF EXISTS gps_tracker;
CREATE DATABASE gps_tracker;

-- Use database gps_tracker
\c gps_tracker;


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- import the schema
\i /docker-entrypoint-initdb.d/schema.sql
