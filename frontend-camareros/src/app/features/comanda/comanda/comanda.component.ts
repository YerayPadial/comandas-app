import { Component, OnInit, signal, computed } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ComandaService } from '../../../core/services/comanda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comanda',
  templateUrl: './comanda.component.html',
  imports: [NgFor, NgIf, CurrencyPipe],
})
export class ComandaComponent implements OnInit {
  nombreMesa = '';
  productosComanda = signal<{ producto: any, cantidad: number }[]>([]);

  constructor(private router: Router, private comandaService: ComandaService) { }

  total = computed(() =>
    this.productosComanda().reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0)
  );

  ngOnInit() {
    const json = localStorage.getItem('comanda');
    if (json) {
      const data = JSON.parse(json);
      this.nombreMesa = data.nombreMesa;
      this.productosComanda.set(data.productos);
    }
  }

  sumar(item: any) {
    this.productosComanda.update(arr =>
      arr.map(i => i === item ? { ...i, cantidad: i.cantidad + 1 } : i)
    );
    this.save();
  }

  restar(item: any) {
    if (item.cantidad > 1) {
      this.productosComanda.update(arr =>
        arr.map(i => i === item ? { ...i, cantidad: i.cantidad - 1 } : i)
      );
      this.save();
    }
  }

  eliminar(item: any) {
    this.productosComanda.update(arr => arr.filter(i => i !== item));
    this.save();
  }

  save() {
    localStorage.setItem('comanda', JSON.stringify({
      nombreMesa: this.nombreMesa,
      productos: this.productosComanda()
    }));
  }

  volverMesa() {
    window.history.back();
  }

  confirmarPedido() {
    const productos = this.productosComanda().map(item => ({
      producto_id: item.producto.id,
      cantidad: item.cantidad
    }));

    const comanda = {
      nombre_mesa: this.nombreMesa,
      productos
    };

    this.comandaService.crearComanda(comanda).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Comanda enviada!',
          showConfirmButton: false,
          timer: 1000
        }).then(() => {
          localStorage.removeItem('comanda');
          this.router.navigate(['/dashboard']);
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al enviar la comanda. Intenta de nuevo.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}