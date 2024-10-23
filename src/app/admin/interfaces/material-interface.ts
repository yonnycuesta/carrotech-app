export interface IMaterial {
  id: string;
  code: string;
  name: string;
  type: string;
  created_at: Date;
}


export interface IMaterialStore {
  code: string;
  name: string;
  unit: string;
  type: number;
}

export interface IMaterialStoreImport {
  Codigo: string;
  Nombre: string;
  Tipo: number;
  Unidad: string;
}
