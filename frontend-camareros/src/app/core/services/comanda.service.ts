import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comanda } from '../models/comanda.model';

@Injectable({ providedIn: 'root' })
export class ComandaService {
  private API_URL = 'https://padiyera.com/api/public/api';

  constructor(private http: HttpClient) { }

  getComandas(): Observable<Comanda[]> {
    return this.http.get<Comanda[]>(`${this.API_URL}/comandas`);
  }

  crearComanda(data: any): Observable<Comanda> {
    return this.http.post<Comanda>(`${this.API_URL}/comandas`, data);
  }

  actualizarComanda(id: number, data: any): Observable<Comanda> {
    return this.http.patch<Comanda>(`${this.API_URL}/comandas/${id}`, data);
  }
}