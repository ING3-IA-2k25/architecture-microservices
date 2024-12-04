import { defineStore } from "pinia";
import type { Static } from "vue";

// TODO: change variable to env variable
//        (it rly start to piss me off so I let someone else do it)
const API_URL = "http://localhost:8000"

// define a variable to enable the loopback (call api automatically every 2 seconds)
let loopback : boolean = true;

// define a producer type
export interface Producer {
  id: number;
  name: string;
  selected: boolean;
}

// Define a new store
export const useProducersStore = defineStore("producers", {

  state: () => ({
    producers: [
      { id: -1, name: "DEFAULT", selected: false },
    ] as Producer[],
  }),


  getters: {
    // return the selected producers
    getSelectedProducersName(): string[] {
      const selected: Producer[] = this.producers.filter((producer: Producer) => producer.selected);

      // const url = process.env.API_URL
      // console.log(url)
      // return the selected producers names
      const selectedNames: string[] = selected.map((producer: Producer) => producer.name);
      return selectedNames;
    },

    // return the selected producers names
    getAllProducersName(): string[] {
      // return the selected producers names
      const allNames: string[] = this.producers.map((producer: Producer) => producer.name);
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

  },
});
