// composables/useLeafleatMap.ts
import { ref, onMounted, onUnmounted } from 'vue';
import L from 'leaflet';
//import { useMetrographStore } from '@/stores/metrograph';
import MapService from '@/services/mapService';
//import StationMarkerService from '@/services/StationMarkerService';
//import ConnectionLineService from '@/services/ConnectionLineService';


// make the map unique and global
const mapInstance = ref<L.Map | null>(null);

export function useLeafletMap() {
  //const store = useMetrographStore();
  //
  const mapService = new MapService();
  //const stationService = new StationMarkerService();
  //const connectionService = new ConnectionLineService();


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

  onMounted(async () => {
    //await store.loadGraph();
  });

  onUnmounted(() => {
    //stationService.removeStationMarkers();
    //connectionService.removeConnectionLines();
    mapInstance.value?.remove();
  });

  return {
    mapInstance,
    initMap,
    updateMap
  };
}
