// define a producer type
export type Producer = {
  id: number;
  name: string;
  selected: boolean;
  online: boolean;
  timeout: number;
}

export type ProducerApiResponse = {
  id: number;
  name: string;
}


// define meta datas for producers
export type ProducersMetaData = {
  name: string;
  online: boolean;
  selected: boolean;
}

