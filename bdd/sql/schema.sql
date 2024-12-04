-- Create the producer table with SERIAL id
CREATE TABLE producer (
    id SERIAL PRIMARY KEY NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL
);

-- Create the coords_gps table with foreign key
CREATE TABLE coords_gps (
    producer_id INTEGER NOT NULL,  -- Foreign key referencing producer(id)
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    CONSTRAINT coords_gps_latitude_check CHECK (latitude >= -90 AND latitude <= 90),
    CONSTRAINT coords_gps_longitude_check CHECK (longitude >= -180 AND longitude <= 180),
    CONSTRAINT fk_id FOREIGN KEY (producer_id) REFERENCES producer(id)  -- Foreign key constraint
);
