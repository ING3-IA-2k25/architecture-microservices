<script setup lang="ts">
// components
import UserCard from '@/components/UserCard.vue';

/* eslint-disable*/
// plugins import
import { onMounted, ref, onUpdated} from 'vue';
import "leaflet/dist/leaflet.css";

// stores
import { useProducersStore } from '@/stores/producers';
import { useCoordsStore } from '@/stores/coords';
const producersStore = useProducersStore();
const coordsStore = useCoordsStore();

// make sure the loopback is enable
//producersStore.enableLoopback();
//coordsStore.enableLoopback();

// composable (leaflet)
import { useLeafletMap } from "@/composables/useLeafletMap";
const { initMap , addGPSMarker, focusOnProducer, unselectProducer, resetGPSMarkersForProducer }  = useLeafletMap();

// type to format the gps data
import type { GPS_Coords } from "@/types/gps_coord.types";



// to change with env vairable
const wsUrl = 'ws://localhost:8000/ws/front';

// setup websocket
let ws : WebSocket;
ws = new WebSocket(wsUrl);
let keepAlive = setInterval(() => {
  ws.send('keep alive');
}, 5000);

ws.onerror = (event: Event) => {

}

ws.onclose = (event: CloseEvent) => {
  console.debug('ws closed');
  // retry to connect
  setTimeout(() => {
    ws = new WebSocket(wsUrl);
  }, 500);
}
// test
const gps: GPS_Coords = {
  producer_uid: 5,
  uid: 1,
  latitude: 43.2996,
  longitude: -0.370000,
}

const gps2: GPS_Coords = {
  producer_uid: 5,
  uid: 2,
  latitude: 43.29955,
  longitude: -0.370000,
}


onMounted(async () => {
  const zoom: number = 12;
  const lat: number = 43.3;
  const lon: number = -0.37;
  initMap('map', lat, lon, zoom);

  // test
  await addGPSMarker(gps);
  await addGPSMarker(gps2);

  // on message
  ws.onmessage = async (event: MessageEvent) => {
    const msg : string = event.data;

    const [id, latitude, longitude]: [number, number,number] = msg.split(',');

    const gps: GPS_Coords = {
      producer_uid: parseInt(id),
      uid: -1, // we do not need this, we probably should remove it
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    }

   addGPSMarker(gps);
  }

});




</script>

<template>
  <main>
    <div class="flex flex-row justify-center bg-ctp-frappe-base h-screen mt--16 pt-16  ">
      <!-- Left colone -->
      <div id="left-col" class="h-full w-75 relative">

        <!-- div pour la map center -->
        <div class="absolute p-15! h-full w-full">
          <div class="bg-ctp-latte-mauve h-full w-full" ref="mapDiv" id="map">
          </div>
        </div>
      </div>

      <!-- Right colone -->
      <div id="right-col" class="h-full w-25">

        <div class="absolute m-0 p-10! h-full w-25">
          <div class=" h-full w-full" id="mapContainer">

            <user-card
              v-for="producer in producersStore.producers"
              @emit-select="() => {
                producer.selected = !producer.selected;
                console.log(producer.selected);
                if (producer.selected == false) {
                  unselectProducer(producer.id);
                } else {
                  console.log('reset');
                  resetGPSMarkersForProducer(producer.id);
                }
              }"
              @emit-focus="() => {focusOnProducer(producer.id)}"
              :name="producer.name" :selected="producer.selected" :online="producer.online">
              {{ producer.name }}
            </user-card>

          </div>
        </div>

      </div>
    </div>
  </main>
</template>
