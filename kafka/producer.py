import sys
import random
import struct
import time
from kafka.vendor import six
from kafka import KafkaProducer

# load server name from env
import os
server_name = os.getenv('KAFKA_SERVER_NAME', 'localhost')

if sys.version_info >= (3, 12, 0):
    sys.modules['kafka.vendor.six.moves'] = six.moves

producer = KafkaProducer(
    bootstrap_servers=f'{server_name}:9092',  # Adresse du broker Kafka
    value_serializer=lambda v: v  # Pas de sérialisation automatique
)

# Fonction pour générer des coordonnées aléatoires autour de Pau (43.3, -0.37)
def generate_random_coordinates(center_lat=43.3, center_lon=-0.37, delta=0.01):
    """
    Génère des coordonnées GPS aléatoires autour d'une position centrale.

    :param center_lat: Latitude centrale.
    :param center_lon: Longitude centrale.
    :param delta: Variation maximale autour du point central.
    :return: Tuple (latitude, longitude).
    """
    latitude = center_lat + random.uniform(-delta, delta)
    longitude = center_lon + random.uniform(-delta, delta)
    return round(latitude, 6), round(longitude, 6)  # Limiter la précision

# Fonction pour construire le message
def build_message(name, latitude, longitude):
    """
    Construit le message au format :
    - Chaîne pour le nom
    - Octet de fin de chaîne (0x00)
    - Deux floats (latitude, longitude)

    :param name: Nom de la personne.
    :param latitude: Coordonnée latitude.
    :param longitude: Coordonnée longitude.
    :return: Message sous forme de bytes.
    """
    name_bytes = name.encode('utf-8') + b'\x00'  # Encodage de la chaîne avec octet de fin
    coords_bytes = struct.pack('ff', latitude, longitude)  # Sérialiser les deux floats
    print(name_bytes)
    print(coords_bytes)

    return name_bytes + coords_bytes

# Simuler les déplacements
def simulate_movement(person_name = "Leo-Paul"):
    topic_name = "gps-coordonates"  # Nom du topic Kafka

    print("Début de la simulation des déplacements GPS autour de Pau...")
    try:
        while True:
            # Générer des coordonnées aléatoires
            lat, lon = generate_random_coordinates()
            # Construire le message
            message = build_message(person_name, lat, lon)
            # Envoyer le message au topic Kafka
            producer.send(topic_name, message)
            producer.flush()
            print(f"Message envoyé : Nom={person_name}, Lat={lat}, Lon={lon}")
            time.sleep(2)  # Pause de 2 secondes entre chaque message
    except KeyboardInterrupt:
        print("\nSimulation interrompue. Fermeture du Producer Kafka...")
    finally:
        producer.close()

# Lancer la simulation
if __name__ == "__main__":
    # check user arguments
    if len(sys.argv) > 1:
        person_name = sys.argv[1]
        simulate_movement(person_name)
    else:
        simulate_movement()
