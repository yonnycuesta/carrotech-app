import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../home/services/auth/auth.service';
import { IOrderManager } from '../../../interfaces/order-manager.interface';
import { HelperService } from '../../../services/helper.service';
import { OrderStoragaManagerService } from '../../../services/order-manager.service';
import { OrderStatuComponent } from '../../orders/order-statu/order-statu.component';
import { ProgressComponent } from '../../../helpers/progress/progress.component';

@Component({
  selector: 'app-order-approved',
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
  templateUrl: './order-approved.component.html',
  styleUrl: './order-approved.component.scss'
})
export class OrderApprovedComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['code', 'staff_name', 'shift', 'statu',
    'comment', 'calendar', 'delivered_opt',
    'created_at', 'action'];

  dataSource = new MatTableDataSource<IOrderManager>();
  private authService = inject(AuthService);

  public user = computed(() => this.authService.currentUser());
  managerId: any = '';

  isLoading: boolean = true;
  private _route = inject(ActivatedRoute);


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
      this.sOrderMang.indexApproved(this.managerId).subscribe({
        next: (resp: any) => {
          this.dataSource.data = resp.sort((a: any, b: any) => a.shift - b.shift);
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
          Swal.fire({
            title: 'Sin ordenes',
            text: err.error.detail + ' aprobadas en este momento.',
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


}
