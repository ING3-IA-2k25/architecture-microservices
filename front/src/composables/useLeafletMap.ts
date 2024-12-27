// composables/useLeafleatMap.ts
import { ref, onMounted, onUnmounted } from 'vue';
import L from 'leaflet';
import GPSMarkerService  from "@/services/gpsMarkerService"
import MapService from '@/services/mapService';
import type { GPS_Coords } from '@/types/gps_coord.types';
import type { GPS_position } from '@/types/gps_coord.types';
import { useCoordsStore } from '@/stores/coords';
//import { useMetrographStore } from '@/stores/metrograph';
//import StationMarkerService from '@/services/StationMarkerService';
//import ConnectionLineService from '@/services/ConnectionLineService';


// make the map unique and global
const mapInstance = ref<L.Map | null>(null);


export function useLeafletMap() {
  //const store = useMetrographStore();
  //
  const mapService = new MapService();
  const gpsMarkerService = GPSMarkerService.getInstance();
  const coordsStore = useCoordsStore();
  //const connectionService = new ConnectionLineService();
  //const stationService = new StationMarkerService();


  const initMap = (elementId: string, lat: number = 43.3, lon: number =  -0.37, zoom: number = 12) => {
    const mapCenter = new L.LatLng(lat, lon);
    mapInstance.value = mapService.initializeMap(elementId, mapCenter, zoom);

    updateMap();
  };



  const updateMap = () => {
    if (!mapInstance.value ) { //|| !store.graph) {
      //setTimeout(updateMap, 1000);
      return;
    }

    console.log('Updating map...');
    //console.log(store.graph.nodes, 'stations');

    //console.log(typeof store.graph.nodes[5].gps);
    //const validStations = store.graph.nodes.filter(station =>
    //  station.gps !== null
    //);
    //
    //console.log(validStations.length, 'valid stations');
    //
    //stationService.addStationMarkers(mapInstance.value as L.Map, validStations);
    //connectionService.addConnectionLines(
    //  mapInstance.value as L.Map,
    //  store.graph.edges,
    //  validStations
    //);
  };


  const addGPSMarker = (gps: GPS_Coords) => {
    if (!mapInstance.value) {
      return;
    }

    // add the marker to the map
    const gps_position: GPS_position = {lat: gps.latitude, lon: gps.longitude};
    gpsMarkerService.addMarker(mapInstance.value, gps_position, gps.producer_uid);

    // add position to the store
    coordsStore.addNewCoord(gps_position, gps.producer_uid);
  };



  onMounted(async () => {
    //await store.loadGraph();
  });

  onUnmounted(() => {
    //stationService.removeStationMarkers();
    //connectionService.removeConnectionLines();
    mapInstance.value?.remove();
    gpsMarkerService.removeMarkers();
  });

  return {
    mapInstance,
    initMap,
    updateMap,
    addGPSMarker
  };
}
