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
  }

  verComanda() {
    localStorage.setItem('comanda', JSON.stringify({
      nombreMesa: this.nombreMesa,
      productos: Object.values(this.comandaActual)
    }));
    this.router.navigate(['/comanda']);
  }

  get productosFiltrados(): Producto[] {
    return this.productos.filter(p => p.categoria === this.categoriaSeleccionada);
  }

  get tieneComanda(): boolean {
    return Object.keys(this.comandaActual).length > 0;
  }
}