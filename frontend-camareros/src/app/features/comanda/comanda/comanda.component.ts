import { Component, OnInit, signal, computed } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comanda',
  templateUrl: './comanda.component.html',
  imports: [NgFor, NgIf, CurrencyPipe]
})
export class ComandaComponent implements OnInit {
  nombreMesa = '';
  productosComanda = signal<{ producto: any, cantidad: number }[]>([]);

  constructor(private router: Router) {}

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
    // (Falta) Enviar api
    alert('¡Pedido confirmado! (Funcionalidad en desarrollo)');
    localStorage.removeItem('comanda');
    this.router.navigate(['/dashboard']);
  }
}