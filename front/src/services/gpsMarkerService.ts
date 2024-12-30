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
  }

  public addLine(map: L.Map, coord1: GPS_position, coord2: GPS_position, producer_id: number): void {
    // we draw a line between the last two coords
    const line : L.Polyline = L.polyline(
      [
        [coord1.lat, coord1.lon],
        [coord2.lat, coord2.lon]
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

    for (const circles of this.markersIdx2LeafMarker.values()) {
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
