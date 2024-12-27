-- name: CreateProducer :one
INSERT INTO producer (
    name
) VALUES (
    $1
) RETURNING *;


-- name: CreateCoords_gps :one
INSERT INTO coords_gps (
    producer_id,
    latitude,
    longitude
) VALUES (
    $1,
    $2,
    $3
) RETURNING *;

-- name: GetProducerByName :one
SELECT * FROM producer 
WHERE name = $1;

-- name: GetProducerById :one
SELECT * FROM producer 
WHERE id = $1;

-- name: GetCoordsGpsByProducerId :one
SELECT * FROM coords_gps 
WHERE producer_id = $1;

-- name: GetAllProducers :many
SELECT * FROM producer;

-- name: GetAllCoordsGps :many
SELECT * FROM coords_gps;

-- name: GetAllTables :many
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
