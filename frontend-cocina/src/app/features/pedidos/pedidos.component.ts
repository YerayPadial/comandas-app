import { Component, signal, computed, OnDestroy } from '@angular/core';
import { ComandaService } from '../../core/services/comanda.service';
import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos',
  imports: [NgFor, NgIf, NgClass, CurrencyPipe],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnDestroy {
  filtroEstado = signal<'pendiente' | 'lista'>('pendiente');
  comandas = signal<any[]>([]);
  private pollingIntervalId: any;

  constructor(private comandaService: ComandaService) { }

  ngOnInit() {
    this.cargarComandas();
    this.pollingIntervalId = setInterval(() => {
      this.cargarComandas();
    }, 2500); // Polling cada 2.5 segundos
  }

  ngOnDestroy() {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId);
    }
  }

  cargarComandas() {
    this.comandaService.getComandas().subscribe(res => {
      this.comandas.set(res.filter(c => c.estado !== 'cobrada'));
    });
  }

  comandasFiltradas = computed(() =>
    this.comandas().filter(c => c.estado === this.filtroEstado())
  );

  total(comanda: any): number {
    if (!comanda.detalles) return 0;
    return comanda.detalles.reduce(
      (acc: number, d: any) => acc + d.cantidad * d.producto.precio, 0
    );
  }

  cambiarEstado(comanda: any, nuevoEstado: 'lista' | 'cobrada') {
    this.comandaService.actualizarComanda(comanda.id, { estado: nuevoEstado })
      .subscribe(() => {
        if (nuevoEstado === 'cobrada') {
          this.comandas.set(this.comandas().filter(c => c.id !== comanda.id));
          Swal.fire({
            icon: 'success',
            title: 'Comanda cobrada',
            showConfirmButton: false,
            timer: 1000
          });
        } else {
          this.comandas.set(this.comandas().map(c =>
            c.id === comanda.id ? { ...c, estado: nuevoEstado } : c
          ));
          Swal.fire({
            icon: 'success',
            title: 'Comanda preparada',
            showConfirmButton: false,
            timer: 1000
          });
        }
      });
  }

  get pendientesCount() {
    return this.comandas().filter(c => c.estado === 'pendiente').length;
  }
  get listasCount() {
    return this.comandas().filter(c => c.estado === 'lista').length;
  }
}