import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../../core/services/producto.service';
import { Producto } from '../../../core/models/producto.model';
import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mesa',
  standalone: true,
  templateUrl: './mesa.component.html',
  imports: [NgFor, NgIf, NgClass, CurrencyPipe, FormsModule],
})
export class MesaComponent implements OnInit {
  nombreMesa = '';
  productos: Producto[] = [];
  categorias: string[] = [];
  categoriaSeleccionada = '';
  comandaActual: { [id: number]: { producto: Producto, cantidad: number } } = {};

  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.nombreMesa = params['nombre'] || '';
    });

    // Cargar comanda existente de localStorage (si la hay)
    const comandaAnterior = localStorage.getItem('comanda');
    if (comandaAnterior) {
      try {
        const data = JSON.parse(comandaAnterior);
        if (data && data.productos) {
          for (const item of data.productos) {
            this.comandaActual[item.producto.id] = {
              producto: item.producto,
              cantidad: item.cantidad
            };
          }
        }
      } catch (e) {}
    }

    this.productoService.getProductos().subscribe(productos => {
      this.productos = productos;
      this.categorias = Array.from(new Set(productos.map(p => p.categoria)));
      this.categoriaSeleccionada = this.categorias[0] || '';
      this.loading.set(false);
    });
  }

  agregarProducto(producto: Producto) {
    if (this.comandaActual[producto.id]) {
      this.comandaActual[producto.id].cantidad++;
    } else {
      this.comandaActual[producto.id] = { producto, cantidad: 1 };
    }
    this.saveComanda();
  }

  restarProducto(producto: Producto, event: MouseEvent) {
    event.stopPropagation();
    const item = this.comandaActual[producto.id];
    if (item) {
      item.cantidad--;
      if (item.cantidad <= 0) {
        delete this.comandaActual[producto.id];
      }
      this.saveComanda();
    }
  }

  saveComanda() {
    localStorage.setItem('comanda', JSON.stringify({
      nombreMesa: this.nombreMesa,
      productos: Object.values(this.comandaActual)
    }));
  }

  verComanda() {
    this.saveComanda();
    this.router.navigate(['/comanda']);
  }

  get productosFiltrados(): Producto[] {
    return this.productos.filter(p => p.categoria === this.categoriaSeleccionada);
  }

  get tieneComanda(): boolean {
    return Object.keys(this.comandaActual).length > 0;
  }
}