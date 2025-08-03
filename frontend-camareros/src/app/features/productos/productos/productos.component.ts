import { Component, OnInit, signal, computed } from '@angular/core';
import { ProductoService } from '../../../core/services/producto.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Producto } from '../../../core/models/producto.model';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { ProductoDialogComponent } from './../producto-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  imports: [NgFor, NgIf, CurrencyPipe],
})
export class ProductosComponent implements OnInit {
  productos = signal<Producto[]>([]);
  categorias = signal<string[]>([]);
  loading = signal(false);

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