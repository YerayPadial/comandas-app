import { Producto } from './producto.model';

export interface DetalleComanda {
  producto_id: number;
  cantidad: number;
  producto?: Producto;
}