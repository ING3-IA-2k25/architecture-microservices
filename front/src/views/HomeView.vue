<script setup lang="ts">
/* eslint-disable*/
import { onMounted, ref } from 'vue';
import "leaflet/dist/leaflet.css";
import L from 'leaflet'
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";

const zoom = ref(12)
const center = ref([43.299999, -0.370000])
</script>

<template>
  <main>
    <div class="flex flex-row justify-center bg-ctp-frappe-base h-screen mt--16 pt-16  ">
      <!-- Left colone -->
      <div id="left-col" class="h-full w-75 relative">

        <!-- div pour la map center -->
        <div class="absolute p-15! h-full w-full">
          <div class="bg-ctp-latte-mauve h-full w-full" ref="mapDiv">
            <l-map ref="map" v-model:zoom="zoom" :center="center" :use-global-leaflet="false">
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              layer-type="base"
              name="OpenStreetMap"
            ></l-tile-layer>
          </l-map>
          </div>
        </div>
      </div>

      <!-- Right colone -->
      <div id="right-col" class="h-full w-25">

        <div class="absolute m-0 p-10! h-full w-25">
          <div class="bg-ctp-mocha-pink h-full w-full" id="mapContainer">

          </div>
        </div>

      </div>
    </div>
  </main>
</template>
