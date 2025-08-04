import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { ProductoService } from '../../../core/services/producto.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Producto } from '../../../core/models/producto.model';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { ProductoDialogComponent } from '../producto-dialogo/producto-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  imports: [
    NgFor, NgIf, CurrencyPipe, MatButtonModule, MatPaginatorModule, MatSelectModule, MatIconModule, FormsModule, RouterLink
  ],
})
export class ProductosComponent implements OnInit {
  productos = signal<Producto[]>([]);
  categorias = signal<string[]>([]);
  loading = signal(false);

  // Filtro, paginación y ordenación
  categoriaSeleccionada = signal<string>('Todos');
  paginaActual = signal<number>(0);
  productosPorPagina = 6;
  orden = signal<{ campo: 'nombre' | 'precio', direccion: 'asc' | 'desc' }>({ campo: 'nombre', direccion: 'asc' });

  constructor(
    private productoService: ProductoService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.productoService.getProductos().subscribe(prods => {
      this.productos.set(prods);
      this.categorias.set([...new Set(prods.map(p => p.categoria))]);
      this.loading.set(false);
    });
  }

  // Productos filtrados, ordenados y paginados
  productosFiltrados = computed(() => {
    let arr = this.productos();
    if (this.categoriaSeleccionada() !== 'Todos') {
      arr = arr.filter(p => p.categoria === this.categoriaSeleccionada());
    }
    // Ordenar
    arr = arr.slice().sort((a, b) => {
      let res = 0;
      if (this.orden().campo === 'nombre') {
        res = a.nombre.localeCompare(b.nombre);
      } else {
        res = a.precio - b.precio;
      }
      return this.orden().direccion === 'asc' ? res : -res;
    });
    return arr;
  });

  productosPaginados = computed(() => {
    const start = this.paginaActual() * this.productosPorPagina;
    return this.productosFiltrados().slice(start, start + this.productosPorPagina);
  });

  cambiarCategoria(cat: string) {
    this.categoriaSeleccionada.set(cat);
    this.paginaActual.set(0); // Reiniciar paginación al filtrar
  }

  cambiarOrden(campo: 'nombre' | 'precio') {
    if (this.orden().campo === campo) {
      // Cambiar dirección
      this.orden.set({
        campo,
        direccion: this.orden().direccion === 'asc' ? 'desc' : 'asc'
      });
    } else {
      this.orden.set({ campo, direccion: 'asc' });
    }
  }

  onPageChange(event: any) {
    this.paginaActual.set(event.pageIndex);
  }

  openNuevoProducto() {
    const dialogRef = this.dialog.open(ProductoDialogComponent, {
      width: '400px',
      data: {
        categorias: this.categorias(),
        producto: null
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productoService.crearProducto(result).subscribe(() => {
          this.snackbar.open('Producto creado', '', { duration: 1500 });
          this.loadData();
        });
      }
    });
  }

  openEditarProducto(prod: Producto) {
    const dialogRef = this.dialog.open(ProductoDialogComponent, {
      width: '500px',
      data: {
        categorias: this.categorias(),
        producto: prod
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productoService.actualizarProducto(prod.id, result).subscribe(() => {
          this.snackbar.open('Producto actualizado', '', { duration: 1500 });
          this.loadData();
        });
      }
    });
  }

  eliminarProducto(prod: Producto) {
    Swal.fire({
      title: `¿Eliminar el producto "${prod.nombre}"?`,
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminarProducto(prod.id).subscribe(() => {
          this.snackbar.open('Producto eliminado', '', { duration: 1500 });
          this.loadData();
        });
      }
    });
  }
}