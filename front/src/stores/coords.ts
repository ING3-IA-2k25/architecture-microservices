import { defineStore } from "pinia";
import type { GPS_Coords} from '@/types/gps_coord.types';
import type { GPS_state } from '@/types/gps_coord.types';
import type { GPS_position } from '@/types/gps_coord.types';

const API_URL = import .meta.env.VITE_API_URL as string;

let loopback : boolean = true;


// Define a new store
export const useCoordsStore = defineStore("coords", {

  state: () =>  ({
      //coords: [] as GPS_state[]
      prod2coords: new Map<number, GPS_position[]>()
  }),


  getters: {
    getCoordsByUid: (state) =>{

      return (uid: number): GPS_position[] => {
        //const producer_data : GPS_state[] = state.coords.filter((coord: GPS_state) => coord.producer_id === uid);
        const producer_coords: GPS_position[] = state.prod2coords.get(uid) ?? [];

        /*  old stuff
        if (producer_data.length === 0) {
          return [];
        }

        if (producer_data.length > 1) {
          console.error("multiple producers with the same uid");
        }
        */

        return producer_coords;
      }

    },


    getCoordsByUids: (state) => {

      return (uids: number[]): GPS_state[] => {
        //const producers_data : GPS_state[] = state.coords.filter((coord: GPS_state) => uids.includes(coord.producer_id));

        const producers_data : GPS_state[] = [];
        uids.forEach((uid: number) => {
          const producer_coords: GPS_position[] = state.prod2coords.get(uid) ?? [];

          producers_data.push({producer_id: uid, coords: producer_coords});
        });

        return producers_data;
      }

    },

  },

  actions: {


    async getAllCoords() : Promise<Map<number, GPS_position[]>>{
      // fetch the producers from the API
      const response = fetch(API_URL + "/api/coords/all");
      const output =  await response;

      // get the producers
      const coords = await output.json() as GPS_Coords[];

      // format the producers
      const mapPro2Coords = new Map<number, GPS_position[]>();

      // group coords by their producer's id
      coords.forEach((coord: GPS_Coords) => {
        if (!mapPro2Coords.has(coord.producer_uid)) {
          mapPro2Coords.set(coord.producer_uid, []);
        }

        const gps : GPS_position = {
          lat: coord.latitude,
          lon: coord.longitude,
        };

        mapPro2Coords.get(coord.producer_uid)!.push(gps);
      });

      // format the producers
      //const producers : GPS_state[] = [];
      //mapPro2Coords.forEach((coords: GPS_position[], producer_id: number) => {
      //  producers.push({producer_id, coords});
      //});

      //return producers;
      return mapPro2Coords;
    },



    addNewCoord(gps: GPS_position, producer_id: number) {
      if (!this.prod2coords.has(producer_id)) {
        this.prod2coords.set(producer_id, []);
      }

      this.prod2coords.get(producer_id)!.push(gps);
    }



    /*
    private_addNewProducers(coords: GPS_Coords[]) {


      // add unique producers to the store
      coords.forEach((coord: GPS_Coords) => {
        if (!this.coords.some((c: GPS_Coords) => c.uid === coord.uid)) {
          this.coords.push(coord);
        }
      });

    },


    // old function to do api polling every 2s
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
        }, 2000);
      }
    }
    */


  },

});




