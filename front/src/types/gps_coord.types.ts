// define a GPS_Coords type
import L from 'leaflet';

export interface GPS_Coords {
  producer_uid: number;
  uid: number;
  latitude: number;
  longitude: number;
}

export type GPS_position = {
  lat: number;
  lon: number;
};

export type GPS_state = {
  producer_id: number;
  coords: GPS_position[];
};

export type CustomMarker = {
  gpsCoords: GPS_Coords;
  marker: L.Marker;
};

