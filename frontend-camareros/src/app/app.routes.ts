import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { MesaComponent } from './features/mesa/mesa/mesa.component';
import { ComandaComponent } from './features/comanda/comanda/comanda.component';
import { PedidosComponent } from './features/pedidos/pedidos/pedidos.component';
import { ProductosComponent } from './features/productos/productos/productos.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'mesa', component: MesaComponent },
    { path: 'comanda', component: ComandaComponent },
    { path: 'pedidos', component: PedidosComponent },
    { path: 'productos', component: ProductosComponent },
];