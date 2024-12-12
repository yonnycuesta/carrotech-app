import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IMaterial, IMaterialStore } from '../../../interfaces/material-interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MaterialService } from '../../../services/material.service';
import { HelperService } from '../../../services/helper.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { MaterialImportModalComponent } from './material-import-modal/material-import-modal.component';
const ELEMENT_DATA: IMaterial[] = [];

@Component({
  selector: 'app-material',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatMenu,
    MatOptionModule,
    MatIconButton,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './material.component.html',
  styleUrl: './material.component.scss'
})
export class MaterialComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'code',
    'name',
    'unit',
    'type',
    'created_at',
    'action'
  ];

  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly sCar: MaterialService,
    private readonly sHelper: HelperService,
    public dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.getMaterials();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getMaterials() {
    try {
      this.sCar.all().subscribe({
        next: (res: any) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (error) => {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteMaterial(id: string) {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "No podras revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sCar.delete(id).subscribe({
          next: (res) => {
            this.sHelper.successMessage('success', 'Material eliminado con exito');
            this.getMaterials();
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
    });
  }

  openImport(): void {
    const dialogRef = this.dialog.open(MaterialImportModalComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.getMaterials();
      }
    });
  }
}
