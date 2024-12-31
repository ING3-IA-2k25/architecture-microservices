import sys
import random
import struct
import time
import math
from kafka.vendor import six
from kafka import KafkaProducer


# load server name from env
import os
from dotenv import load_dotenv
load_dotenv()

server_name = os.getenv('KAFKA_CONTAINER_NAME', 'localhost')
port = os.getenv('KAFKA_CONTAINER_PORT', '9092')

if sys.version_info >= (3, 12, 0):
    sys.modules['kafka.vendor.six.moves'] = six.moves

try :
    print("Trying to connect to the kafka server: ", server_name , ":" , port) 

    producer = KafkaProducer(
            bootstrap_servers=f'{server_name}:{port}',  # Adresse du broker Kafka for docker
            value_serializer=lambda v: v  # Pas de sérialisation automatique
            )
except Exception as e:
    # try to connect to localhost
    try:
        print("Trying to connect to the kafka server: localhost:9092")

        producer = KafkaProducer(
                bootstrap_servers=f'localhost:9092',  # Adresse du broker Kafka
                value_serializer=lambda v: v  # Pas de sérialisation automatique
            )
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

'''
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
'''
# Variables globales pour gérer le déplacement "smooth"
CURRENT_DIRECTION = random.uniform(0, 2 * math.pi)  # direction initiale en radians
TURN_AMPLITUDE = 0.01    # plus c’est grand, plus les virages sont brusques
STEP = 0.0001            # distance parcourue à chaque appel (en degrés)

def generate_random_coordinates(center_lat=43.29539606077581, 
                                center_lon=-0.3709278310443017, 
                                delta=0.0001):
    """
    Génère des coordonnées GPS avec un déplacement progressif ("smooth").
    
    Au lieu de tirer des coords aléatoires autour d’un point central,
    on se base sur une direction globale qu’on modifie légèrement à
    chaque appel. Le paramètre `delta` n’est plus utilisé pour générer
    l’aléatoire autour du centre, mais sert de signature compatible.

    :param center_lat: Latitude précédente (ou la latitude centrale initiale).
    :param center_lon: Longitude précédente (ou la longitude centrale initiale).
    :param delta: Variation maximale (non utilisée ici, pour garder la signature).
    :return: Tuple (latitude, longitude).
    """
    global CURRENT_DIRECTION

    # On avance dans la direction courante d’une "distance" STEP
    new_lat = center_lat + STEP * math.cos(CURRENT_DIRECTION)
    new_lon = center_lon + STEP * math.sin(CURRENT_DIRECTION)

    # On modifie légèrement la direction globale pour un effet "smooth"
    direction_change = random.uniform(-TURN_AMPLITUDE, TURN_AMPLITUDE)
    CURRENT_DIRECTION += direction_change

    # On arrondit à 15 décimales (vous pouvez ajuster à souhait)
    return round(new_lat, 15), round(new_lon, 15)

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
            
            print(message)
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
        print("used argument: ", person_name)
        simulate_movement(person_name)
    else:
        print("No argument found, using environment variable or default value")
        person_name = os.getenv('KAFKA_USERNAME', 'Leo-Paul')
        simulate_movement(person_name)
