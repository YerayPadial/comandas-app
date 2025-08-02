import { NgFor, NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [FormsModule, NgFor]
})
export class DashboardComponent {
  mesas: string[] = [];

  mesaPersonalizada = '';

  constructor(private router: Router) {
    for (let i = 1; i <= 6; i++) {
      this.mesas.push(`Mesa ${i}`);
    }
  }

  seleccionarMesa(nombre: string) {
    localStorage.removeItem('comanda'); 
    this.router.navigate(['/mesa'], { queryParams: { nombre } });
  }

  crearMesaPersonalizada() {
    if (this.mesaPersonalizada.trim()) {
      localStorage.removeItem('comanda'); 
      this.seleccionarMesa(this.mesaPersonalizada.trim());
      this.mesaPersonalizada = '';
    }
  }
}