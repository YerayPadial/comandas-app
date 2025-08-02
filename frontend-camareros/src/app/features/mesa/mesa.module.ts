import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MesaComponent } from './mesa/mesa.component';



@NgModule({
  exports: [MesaComponent],
  imports: [
    CommonModule,
    FormsModule,
    MesaComponent
  ]
})
export class MesaModule { }
