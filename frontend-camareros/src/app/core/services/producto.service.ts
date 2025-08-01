import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private API_URL = 'https://padiyera.com/api/public/api';

  constructor(private http: HttpClient) { }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API_URL}/productos`);
  }

  crearProducto(data: any): Observable<Producto> {
    return this.http.post<Producto>(`${this.API_URL}/productos`, data);
  }

  actualizarProducto(id: number, data: any): Observable<Producto> {
    return this.http.put<Producto>(`${this.API_URL}/productos/${id}`, data);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/productos/${id}`);
  }
}