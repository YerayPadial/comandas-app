import { Component, OnInit, signal, computed } from '@angular/core';
import { ComandaService } from '../../../core/services/comanda.service';
import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  imports: [NgFor, NgIf, NgClass, CurrencyPipe],
})
export class PedidosComponent implements OnInit {
  // estado seleccionado para filtrar
  filtroEstado = signal<'pendiente' | 'lista'>('pendiente');
  // listado de comandas
  comandas = signal<any[]>([]);

  // carga desde la API
  ngOnInit() {
    this.cargarComandas();
  }

  constructor(private comandaService: ComandaService) { }

  cargarComandas() {
    this.comandaService.getComandas().subscribe(res => {
      // solo las que no están cobradas, orden descendente por fecha
      this.comandas.set(res.filter(c => c.estado !== 'cobrada'));
    });
  }

  // filtrado reactivo
  comandasFiltradas = computed(() =>
    this.comandas().filter(c => c.estado === this.filtroEstado())
  );

  // calcular total de la comanda
  total(comanda: any): number {
    if (!comanda.detalles) return 0;
    return comanda.detalles.reduce(
      (acc: number, d: any) => acc + d.cantidad * d.producto.precio, 0
    );
  }

  cambiarEstado(comanda: any, nuevoEstado: 'lista' | 'cobrada') {
    this.comandaService.actualizarComanda(comanda.id, { estado: nuevoEstado })
      .subscribe(() => {
        // si es 'cobrada', la quitamos del listado, si no, actualizamos su estado
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
}