import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { IMaterialStore, IMaterialStoreImport } from '../../../../interfaces/material-interface';
import * as XLSX from 'xlsx';
import { MaterialService } from '../../../../services/material.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-material-import-modal',
  standalone: true,
  imports: [
    MatDialogModule, MatButtonModule,
    MatIconModule, FormsModule,
    MatButton
  ],
  templateUrl: './material-import-modal.component.html',
  styleUrl: './material-import-modal.component.scss'
})
export class MaterialImportModalComponent implements OnInit {

  materials: IMaterialStore[] = [];

  constructor(
    public dialogRef: MatDialogRef<MaterialImportModalComponent>,
    private readonly sMaterial: MaterialService,
  ) { }

  ngOnInit(): void {
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        this.materials = XLSX.utils.sheet_to_json(ws);
      };
      reader.readAsBinaryString(file);
    }
  }

  onSubmit() {
    try {
      if (this.materials.length > 0) {
        this.sMaterial.storeImport(this.materials).subscribe({
          next: (res) => {
            Swal.fire('Success', 'Datos importados correctamente', 'success');
            this.dialogRef.close({ data: { action: 1 } });
          },
          error: (err) => {
            Swal.fire('Error', 'Error al importar los datos', 'error');
          }
        });
      } else {
        Swal.fire('Error', 'No se encontraron datos', 'error');
      }
    } catch (error) {
      console.log(error);
    }
  }

  closeDialog() {
    this.dialogRef.close({ data: { action: 'Cancelar' } });
  }
}
