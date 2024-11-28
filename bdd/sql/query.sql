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

-- name: GetCoordsGpsByProducerId :one
SELECT * FROM coords_gps 
WHERE producer_id = $1;
