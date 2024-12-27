// services/gpsMarkerService.ts
import L from 'leaflet';
import type { GPS_state } from '@/types/gps_coord.types';
import type { GPS_position } from '@/types/gps_coord.types';
import { useCoordsStore }  from '@/stores/coords';



type CustomMarker = L.Circle | L.Polyline;

export default class GPSMarkerService {
  private static instance: GPSMarkerService;
  //private markers: CustomMarker[] = [];
  private markersIdx2LeafMarker: Map<number, CustomMarker[]>= new Map<number, CustomMarker[]>();
  private coordsStore = useCoordsStore();

  private constructor() {}

  public static getInstance(): GPSMarkerService {
    if (!GPSMarkerService.instance) {
      GPSMarkerService.instance = new GPSMarkerService();
    }
    return GPSMarkerService.instance;
  }

  public addMarker(map: L.Map, gpsCoords: GPS_position, producer_id: number): void {
    console.debug('Adding marker...');

    const circle = L.circle(
      [gpsCoords.lat, gpsCoords.lon],
      {
        color: 'red',
        radius: 1,
        weight: 1
      }
    );

    // Add the circle to the map
    circle.addTo(map);

    // add circle to local store
    if (!this.markersIdx2LeafMarker.has(producer_id)) {
      this.markersIdx2LeafMarker.set(producer_id, []);
    }

    this.markersIdx2LeafMarker.get(producer_id)!.push(circle);

    // get all the coords of this producer
    const coords_of_producers : GPS_position[] = this.coordsStore.getCoordsByUid(producer_id);

    // if there no other coords we return
    if (coords_of_producers.length == 0) {
      return;
    }

    // we draw a line between the last two coords
    const last_coords : GPS_position = coords_of_producers[coords_of_producers.length - 1];
    const line : L.Polyline = L.polyline(
      [
        [last_coords.lat, last_coords.lon],
        [gpsCoords.lat, gpsCoords.lon]
      ],
      {
        color: 'red',
        weight: 3.5
      }
    );

    // Add the line to the map
    line.addTo(map);

    // add line to local store
    this.markersIdx2LeafMarker.get(producer_id)!.push(line);
  }


  public removeMarkers(): void {
    console.debug('Removing all markers...');

    for (const [_, circles] of this.markersIdx2LeafMarker) {
      circles.forEach((circle) => circle.remove());
    }

    this.markersIdx2LeafMarker.clear();
  }

  public removeMarkerOfId(id: number) : void {
    console.debug(`Removing marker of id ${id}...`);

    const idxCircles = this.markersIdx2LeafMarker.get(id);

    for (const circle of idxCircles ?? []) {
      circle.remove();
    }

    this.markersIdx2LeafMarker.delete(id);
  }
}
