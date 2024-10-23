import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CarService } from '../../../../services/car.service';
import { ICarResponse } from '../../../../interfaces/car-interfaces';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import Swal from 'sweetalert2';
import { HelperService } from '../../../../services/helper.service';
import { MatTooltipModule } from '@angular/material/tooltip';

const ELEMENT_DATA: ICarResponse[] = [];

@Component({
  selector: 'app-car-page',
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
  templateUrl: './car-page.component.html',
  styleUrl: './car-page.component.scss'
})
export class CarPageComponent implements OnInit, AfterViewInit {

  orders: any;
  displayedColumns: string[] = [
    'plate',
    'model',
    'brand',
    'color',
    'capacity',
    'assigned_date',
    'staff_name',
    'staff_phone',
    'staff_dni',
    'created_at',
    'action'
  ];

  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly sCar: CarService,
    private readonly sHelper: HelperService
  ) { }

  ngOnInit(): void {
    this.getCars();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getCars() {
    try {
      this.sCar.index().subscribe({
        next: (resp: any) => {
          this.dataSource = new MatTableDataSource(resp);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          console.log('Error: ', err);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  deleteCar(id: string) {
    Swal.fire({
      title: 'Confirmación requerida',
      text: "Esta acción es irreversible. ¿Deseas continuar?",
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#D32F2F',
      confirmButtonText: 'Sí, proceder',
      cancelButtonText: 'No, cancelar',
      background: '#f4f6f9',
      customClass: {
        title: 'swal2-title-custom',
        popup: 'swal2-popup-custom'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.sCar.destroy(id).subscribe({
          next: (resp: any) => {
            this.sHelper.successMessage('Registro eliminado', resp.msg);
            this.getCars();
          },
          error: (err) => {
            console.log('Error: ', err);
          }
        });
      }
    });
  }

}
