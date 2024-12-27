<script setup lang="ts">
// components
import UserCard from '@/components/UserCard.vue';

/* eslint-disable*/
import { onMounted, ref, onUpdated} from 'vue';
import "leaflet/dist/leaflet.css";
import L from 'leaflet'
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";

//const zoom = ref(12)
//const center = ref([43.299999, -0.370000])

import { useProducersStore } from '@/stores/producers';
import { useCoordsStore } from '@/stores/coords';
const producersStore = useProducersStore();
const coordsStore = useCoordsStore();

// make sure the loopback is enable
producersStore.enableLoopback();
//coordsStore.enableLoopback();
//
import { useLeafletMap } from "@/composables/useLeafletMap";
const { initMap , addGPSMarker } = useLeafletMap();

// add a marker on the map
import type { GPS_Coords } from "@/types/gps_coord.types";




const gps: GPS_Coords = {
  producer_uid: 1,
  uid: 1,
  latitude: 43.2996,
  longitude: -0.370000,
}

const gps2: GPS_Coords = {
  producer_uid: 1,
  uid: 1,
  latitude: 43.29955,
  longitude: -0.370000,
}

onMounted(() => {
  initMap('map');
  addGPSMarker(gps);
  addGPSMarker(gps2);
});



onUpdated(() => {
  console.log('mounted')
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
              @emit-select="() => {producer.selected = !producer.selected}" :name="producer.name" :selected="producer.selected" :online="false">
              {{ producer.name }}
            </user-card>

          </div>
        </div>

      </div>
    </div>
  </main>
</template>
