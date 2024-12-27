import { defineStore } from "pinia";
import type { Producer} from "@/types/producer.types";
import type { ProducersMetaData } from "@/types/producer.types";
import type { ProducerApiResponse } from "@/types/producer.types";

// TODO: change variable to env variable
//        (it rly start to piss me off so I let someone else do it)
const API_URL = "http://localhost:8000"
const DELAY_MS_BEFORE_OFFLINE = 5000;
// define a variable to enable the loopback (call api automatically every 2 seconds)
let loopback : boolean = true;

// Define a new store
export const useProducersStore = defineStore("producers", {

  state: () => ({
    producers: [] as Producer[],
  }),


  getters: {
    // return the selected producers
    getSelectedProducersData(): ProducersMetaData[] {
      const selected: Producer[] = this.producers.filter((producer: Producer) => producer.selected);

      // const url = process.env.API_URL
      // console.log(url)
      // return the selected producers names
      const selectedNames: ProducersMetaData[] = selected.map(
        (producer: Producer) => {
          return { name: producer.name, online: true, selected: producer.selected };
      });
      return selectedNames;
    },

    // return the selected producers names
    getAllProducersData(): ProducersMetaData[] {
      // return the selected producers names
      const allNames: ProducersMetaData[] = this.producers.map((producer: Producer) => {
        return { name: producer.name, online: true, selected: producer.selected };
      });

      console.log(allNames);
      return allNames;
    },

  },



  actions: {

    async getAllProducers() : Promise<Producer[]> {
      // fetch the producers from the API
      const response = fetch(API_URL + "/api/producers/all");
      const output =  await response;

      // get the producers
      const producers = await output.json();

      // format the producers for the store (by default none are selected)
      const data: Producer[] = producers.map((producer: Producer) => {
        producer.selected = false;
        return producer;
      });

      return data
    },




    // set the producer offline
    setProducerOffline(uid: number) : void {

      for (let i = 0; i < this.producers.length; i++) {

        if (this.producers[i].id === uid) {
          this.producers[i].online = false;
          clearTimeout(this.producers[i].timeout);
          return;
        }

      }
    },


    // reset the timeout before setting the producer offline
    resetTimeout(uid: number) : void {

      for (let i = 0; i < this.producers.length; i++) {

        if (this.producers[i].id === uid) {
          clearTimeout(this.producers[i].timeout);
          this.producers[i].timeout = setTimeout(() => {
            this.setProducerOffline(uid);
          }, DELAY_MS_BEFORE_OFFLINE);
          return;
        }

      }

    },

    async addNewProducerByUid(uid: number) {
      // fetch the producer from the API
      const promise : Promise<Response> = fetch(API_URL + "/api/producers/id/" + uid);
      const response =  await promise;

      if (response.status !== 200) {
        console.error("Error: " + response.status);
        return;
      }

      const prod = await response.json() as ProducerApiResponse;


      // add the producer to the store
      this.producers.push({
        id: prod.id,
        name: prod.name,
        selected: false,
        online: true,
        timeout: setTimeout(() => {
          this.setProducerOffline(prod.id);
        }, DELAY_MS_BEFORE_OFFLINE),
      });
    },


    // return if producers uid exists
    exists(uid: number): boolean {

      for (let i = 0; i < this.producers.length; i++) {
        if (this.producers[i].id === uid) {
          return true;
        }
      }

      return false
    },



/* old stuff, using api polling
    addNewProducers(prod: Producer[]) {
      // add unique producers to the store
      prod.forEach((producer: Producer) => {
        if (!this.producers.some((p: Producer) => p.id === producer.id)) {
          this.producers.push(producer);
        }
      });
    },

    async enableLoopback() : Promise<void> {

      // if it's the first time we call the API, we start the loopback
      if (loopback) {
        console.info("loopback entry");
        // nobody else can start the loopback
        loopback = false;

        // run it 1 directly
        const prod = await this.getAllProducers();
        this.addNewProducers(prod);

        // call the API / functions every 2s
        setInterval(async () => {
          const prod = await this.getAllProducers();
          this.addNewProducers(prod);
        }, 2000);
      }
    }
*/
  },


});
