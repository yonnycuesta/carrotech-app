import { AfterViewInit, Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { OrderStoragaManagerService } from '../../../services/order-manager.service';
import { IOrderManager } from '../../../interfaces/order-manager.interface';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../home/services/auth/auth.service';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OrderStatuComponent } from '../../orders/order-statu/order-statu.component';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { HelperService } from '../../../services/helper.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-order-page',
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
    MatCheckboxModule,
    MatMenuModule,
    MatMenu,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatIconButton,
    RouterModule
  ],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss'
})
export class OrderPageComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['code', 'staff_name', 'shift', 'statu',
    'comment', 'calendar', 'delivered_opt', 'mocode',
    'created_at', 'action'];

  dataSource = new MatTableDataSource<IOrderManager>();
  private authService = inject(AuthService);

  public user = computed(() => this.authService.currentUser());
  managerId: any = '';

  filterOption: string = 'all';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private readonly sOrderMang: OrderStoragaManagerService,
    public dialog: MatDialog,
    private readonly _helpService: HelperService

  ) {
  }


  ngOnInit() {
    this.managerId = this.user()?.id;
    if (this.managerId && this.managerId !== '') {
      setTimeout(() => {
        this.getOrders();
      }, 1000);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getOrders() {
    try {
      this.sOrderMang.index(this.managerId, this.filterOption).subscribe({
        next: (resp: any) => {
          this.dataSource.data = resp.sort((a: any, b: any) => a.shift - b.shift);
        },
        error: (err: any) => {
          console.log('Error: ', err);
          Swal.fire({
            title: 'Error',
            text: 'Error: ' + err.error.detail,
            icon: 'error',
            timer: 2000
          });
        }
      });
    } catch (error) {
      console.log('Error al obtener las ordenes: ', error);
    }
  }

  canApproveOrder(element: any): boolean {
    if (element.statu === 'approved' || element.statu === 'completed') {
      return true; // Always allow re-approval or approval of completed orders
    }

    const previousOrders = this.dataSource.data.filter(order => order.shift < element.shift);
    return previousOrders.every(order =>
      order.statu === 'approved' || order.statu === 'completed'
    );
  }

  updateStatu(order: any) {
    const dialogRef = this.dialog.open(OrderStatuComponent, {
      data: {
        order_id: order.id,
        statu: order.statu
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getOrders();
        Swal.fire({
          title: 'Orden actualizada',
          text: 'La orden ha sido actualizada con éxito',
          icon: 'success',
          timer: 2000
        });
      }
    });
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

  suspendend(id: string) {
    try {
      this.sOrderMang.suspendend(id).subscribe({
        next: (res: any) => {
          Swal.fire({
            title: 'Orden suspendida',
            text: res.message,
            icon: 'success',
            timer: 2000
          });
        },
        error: (err: any) => {
          console.error('Error al suspender la orden: ', err);
          Swal.fire({
            title: 'Error',
            text: 'Error al suspender la orden',
            icon: 'error',
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  newSytexMO(id: string) {
    try {
      this.sOrderMang.newSytexMO(id).subscribe({
        next: (res: any) => {
          Swal.fire({
            title: 'Código de la MO: ' + res.operation,
            text: res.message,
            icon: 'success',
            showConfirmButton: true,
            showCloseButton: true,
            confirmButtonText: "Ententido",
          });
        },
        error: (err: any) => {
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
