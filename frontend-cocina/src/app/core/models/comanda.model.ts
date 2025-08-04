import { DetalleComanda } from './detalle-comanda.model';

export interface Comanda {
  id?: number;
  nombre_mesa: string;
  estado?: string;
  detalles?: DetalleComanda[];
  created_at?: string;
  updated_at?: string;
}