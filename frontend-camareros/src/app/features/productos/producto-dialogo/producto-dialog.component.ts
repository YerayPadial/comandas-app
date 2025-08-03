import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto-dialog',
  standalone: true,
  templateUrl: './producto-dialog.component.html',
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule,
    CommonModule, MatSelectModule, MatOptionModule, MatButtonModule, MatDialogTitle
  ]
})
export class ProductoDialogComponent implements OnInit {
  form!: FormGroup;
  categorias: string[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.crearFormulario();
    this.categorias = this.data.categorias;
    if (this.data.producto) {
      this.form.patchValue(this.data.producto);
    }
  }

  private crearFormulario() {
    return this.fb.group({
      nombre: ['', Validators.required],
      precio: [1, [Validators.required, Validators.min(0.01)]],
      categoria: ['', Validators.required],
    });
  }

  openNuevaCategoria() {
    this.mostrarDialogoNuevaCategoria();
  }

  private mostrarDialogoNuevaCategoria() {
    Swal.fire({
      title: 'Nueva categoría',
      input: 'text',
      inputLabel: 'Nombre de la categoría',
      inputPlaceholder: 'Introduce el nombre',
      showCancelButton: true,
      confirmButtonText: 'Añadir',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) return '¡Debes escribir un nombre!';
        if (this.categorias.includes(value)) return 'Esa categoría ya existe';
        return null;
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        this.categorias.push(result.value);
        this.form.patchValue({ categoria: result.value });
        this.snackbar.open('Categoría añadida', '', { duration: 1500 });
      }
    });
  }

  guardar() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}