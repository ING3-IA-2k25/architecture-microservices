// services/mapService.ts
import L from 'leaflet';

export default class MapService {
  initializeMap(element: string, center: L.LatLng, zoom: number): L.Map {
    const map = L.map(element).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    return map;
  }

  zoomTo(map: L.Map, center_lat: number, center_log: number, zoom: number): void {
    const center = new L.LatLng(center_lat, center_log);

    map.setView(center, zoom);
  }
}

