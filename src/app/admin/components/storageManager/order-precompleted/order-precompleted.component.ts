import { AfterViewInit, Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../home/services/auth/auth.service';
import { IOrderManager } from '../../../interfaces/order-manager.interface';
import { HelperService } from '../../../services/helper.service';
import { OrderStoragaManagerService } from '../../../services/order-manager.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { ProgressComponent } from '../../../helpers/progress/progress.component';

@Component({
  selector: 'app-order-precompleted',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatLabel,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSortModule,
    MatMenuModule,
    MatMenu,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatIconButton,
    RouterModule,
    ProgressComponent
  ],
  templateUrl: './order-precompleted.component.html',
  styleUrl: './order-precompleted.component.scss'
})
export class OrderPrecompletedComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['code', 'staff_name', 'shift', 'statu',
    'comment', 'calendar', 'delivered_opt', 'mocode',
    'created_at', 'action'];

  dataSource = new MatTableDataSource<IOrderManager>();
  private authService = inject(AuthService);

  public user = computed(() => this.authService.currentUser());
  managerId: any = '';
  private _route = inject(ActivatedRoute);
  isLoading: boolean = true;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private readonly sOrderMang: OrderStoragaManagerService,
    public dialog: MatDialog,
    private readonly _helpService: HelperService

  ) {
  }


  ngOnInit() {
    this._route.params.subscribe({
      next: (params) => {
        this.managerId = params['id'];
        this.getOrders();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getOrders() {
    try {
      this.sOrderMang.indexpreCompleted(this.managerId).subscribe({
        next: (resp: any) => {
          this.dataSource.data = resp.sort((a: any, b: any) => a.shift - b.shift);
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
          Swal.fire({
            title: 'Sin ordenes',
            text: err.error.detail + ' pre-completadas en este momento.',
            icon: 'info',
            confirmButtonText: "Entendido"
          });
        }
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Error al obtener las ordenes',
        icon: 'error',
        timer: 4000
      });
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }


  downladItems(order_number: string) {
    try {
      this.sOrderMang.downloadItems(order_number).subscribe({
        next: (res: any) => {
          this._helpService.saveToExcelFile(res, 'Orden_' + order_number);
        },
        error: (err: any) => {
          console.error('Error al descargar el archivo: ', err);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  newSytexMO(id: string) {
    try {
      Swal.fire({
        title: 'Creando MO...',
        text: 'Por favor espere mientras se crea la MO en SYTEX.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.sOrderMang.newSytexMO(id).subscribe({
        next: (res: any) => {
          Swal.close();
          Swal.fire({
            title: 'Código de la MO: ' + res.operation,
            text: res.message,
            icon: 'success',
            showConfirmButton: true,
            showCloseButton: true,
            confirmButtonText: "Ententido",
          });
          this.getOrders();
        },
        error: (err: any) => {
          Swal.close();
          console.error('Error al crear la MO: ', err);
          Swal.fire({
            title: 'Error',
            text: 'Error al crear la MO en SYTEX.',
            icon: 'error',
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

}
