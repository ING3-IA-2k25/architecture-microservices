import random
import math

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

if __name__ == '__main__':
    # Premier appel: on utilise les valeurs par défaut sauf pour le delta pour avoir un point un peut éloigné de pau
    lat, lon = generate_random_coordinates(delta=0.001)
    print(f"Nouvelles coordonnées : Lat={lat:.15f}, Lon={lon:.15f}")

    # On génère 10 points supplémentaires, chacun s’appuie sur le précédent
    for i in range(10):
        lat, lon = generate_random_coordinates(lat, lon)
        print(f"Nouvelles coordonnées : Lat={lat:.15f}, Lon={lon:.15f}")
