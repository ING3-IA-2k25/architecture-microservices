// composables/useLeafleatMap.ts
import { ref, onMounted, onUnmounted } from 'vue';
import L from 'leaflet';
import GPSMarkerService  from "@/services/gpsMarkerService"
import MapService from '@/services/mapService';
import type { GPS_position } from '@/types/gps_coord.types';
import type { GPS_Coords }  from '@/types/gps_coord.types';
import { useCoordsStore } from '@/stores/coords';
import { useProducersStore } from '@/stores/producers';


// make the map unique and global
const mapInstance = ref<L.Map | null>(null);


export function useLeafletMap() {

  const mapService = new MapService();
  const gpsMarkerService = GPSMarkerService.getInstance();
  const coordsStore = useCoordsStore();
  const producersStore = useProducersStore();

  const initMap = (elementId: string, lat: number = 43.3, lon: number =  -0.37, zoom: number = 12) => {
    const mapCenter = new L.LatLng(lat, lon);
    mapInstance.value = mapService.initializeMap(elementId, mapCenter, zoom);

    updateMap();
  };



  const updateMap = () => {
    //if (!mapInstance.value ) { //|| !store.graph) {
    //  //setTimeout(updateMap, 1000);
    //  return;
    //}


  };






  const addGPSMarker = async (gps: GPS_Coords) => {
    if (!mapInstance.value || !(mapInstance.value instanceof L.Map)) {
      return;
    }

    // check if the producer exists
   if (!producersStore.exists(gps.producer_uid)) {
      // if not we add it
      await producersStore.addNewProducerByUid(gps.producer_uid);
    }
    else {
      // if it exists, reset the timeout
      producersStore.resetTimeout(gps.producer_uid);
    }


    // format the gps position
    const gps_position: GPS_position = {lat: gps.latitude, lon: gps.longitude};

    // check if producer is selected
    if (producersStore.isSelected(gps.producer_uid)) {

      // add the marker to the map
      gpsMarkerService.addMarker(mapInstance.value, gps_position, gps.producer_uid);

      // check if there are coords for this producer
      const old_coords : GPS_position[] = coordsStore.prod2coords.get(gps.producer_uid) ?? [];
      if (old_coords.length !== 0) {
        // if there are, we add the line
        const last_coord : GPS_position = old_coords[old_coords.length - 1];
        gpsMarkerService.addLine(mapInstance.value, last_coord, gps_position, gps.producer_uid );
      }
    }

    // add position to the store
    coordsStore.addNewCoord(gps_position, gps.producer_uid);

  };





  const resetGPSMarkersForProducer = (producer_uid: number) => {
    if (!mapInstance.value || !(mapInstance.value instanceof L.Map)) {
      return;
    }

    // if producer does not exist, we do nothing
    if (!producersStore.exists(producer_uid)) {
      return;
    }


    // make sure there are no markers for this producer
    gpsMarkerService.removeMarkerOfId(producer_uid);

    // redo the markers
    const coords : GPS_position[] = coordsStore.prod2coords.get(producer_uid) ?? [];


    // make sure there are coords
    if (coords.length == 0) {
      return;
    }

    // do the first marker
    gpsMarkerService.addMarker(mapInstance.value, coords[0], producer_uid);

    for (let i = 1; i < coords.length; i++) {
      gpsMarkerService.addMarker(mapInstance.value, coords[i], producer_uid);
      gpsMarkerService.addLine(mapInstance.value, coords[i-1], coords[i], producer_uid);
    }
  }




  const focusOnProducer = (producer_uid: number) => {
    if (!mapInstance.value || !(mapInstance.value instanceof L.Map)) {
      return;
    }

    // if producer does not exist, we do nothing
    if (!producersStore.exists(producer_uid)) {
      return;
    }

    const coords : GPS_position[] = coordsStore.prod2coords.get(producer_uid) ?? [];

    if (coords.length == 0) {
      return;
    }

    const last_coord = coords[coords.length - 1];
    mapService.zoomTo(mapInstance.value, last_coord.lat, last_coord.lon, 22);
  }


  const unselectProducer = (producer_uid : number ) => {

    gpsMarkerService.removeMarkerOfId(producer_uid);

  }

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
    addGPSMarker,
    resetGPSMarkersForProducer,
    focusOnProducer,
    unselectProducer
  };
}
