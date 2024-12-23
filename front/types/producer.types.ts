// define a producer type
export interface Producer {
  id: number;
  name: string;
  selected: boolean;
}

// define meta datas for producers
export interface ProducersMetaData {
  name: string;
  online: boolean;
  selected: boolean;
}

