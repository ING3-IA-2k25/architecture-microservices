import { defineStore } from "pinia";
import { toRaw } from "vue";

// TODO: change variable to env variable
const API_URL = "http://localhost:8000";

let loopback : boolean = true;

// define a GPS_Coords type
export interface GPS_Coords {
  producer_uid: number;
  uid: number;
  latitude: number;
  longitude: number;
}

// Define a new store
export const useCoordsStore = defineStore("coords", {

  state: () => ({
    coords: [
      { producer_uid: 18, uid:-1, latitude: 0, longitude: 0 },
    ] as GPS_Coords[],
  }),


  getters: {
    getCoordsByUid: (state) => {

      return (uid: number): GPS_Coords[] => {
        return state.coords.filter((coord: GPS_Coords) => coord.producer_uid === uid);
      }

    },

    getCoordsByUids: (state) => {

      return (uids: number[]): GPS_Coords[] => {
        return state.coords.filter((coord: GPS_Coords) => uids.includes(coord.producer_uid));
      }

    },

  },

  actions: {


    async getAllCoords() : Promise<GPS_Coords[]> {
      console.debug('getAllCoords');
      // fetch the producers from the API
      const response = fetch(API_URL + "/api/coords/all");
      const output =  await response;

      // get the producers
      const coords = await output.json();

      console.log(toRaw(coords));
      return coords as GPS_Coords[];
    },

    private_addNewProducers(coords: GPS_Coords[]) {

      console.log('private_addNewProducers');

      // add unique producers to the store
      coords.forEach((coord: GPS_Coords) => {
        if (!this.coords.some((c: GPS_Coords) => c.uid === coord.uid)) {
          this.coords.push(coord);
        }
      });

      console.debug(toRaw(this.coords));
    },


    async enableLoopback() : Promise<void> {

      // if it's the first time we call the API, we start the loopback
      if (loopback) {
        console.info("loopback entry for pooling coords");
        // nobody else can start the loopback
        loopback = false;

        // run it 1 directly
        const prod = await this.getAllCoords();
        this.private_addNewProducers(prod);

        // call the API / functions every 2s
        setInterval(async () => {
          const prod = await this.getAllCoords();
          this.private_addNewProducers(prod);
          console.log(toRaw(this.coords));
        }, 2000);
      }
    }
  },

});




