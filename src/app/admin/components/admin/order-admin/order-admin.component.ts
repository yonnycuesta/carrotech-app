import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IOrderAdmin } from '../../../interfaces/order-interface';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { PdfService } from '../../../services/pdf.service';
import { OrderWarehouseService } from '../../../services/order-warehouse.service';
import { MatCheckboxModule } from '@angular/material/checkbox';


const ELEMENT_DATA: IOrderAdmin[] = [];

@Component({
  selector: 'app-order-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatOptionModule,
    MatIconButton,
    RouterModule,
    MatCheckboxModule
  ],
  templateUrl: './order-admin.component.html',
  styleUrl: './order-admin.component.scss'
})
export class OrderAdminComponent implements OnInit, AfterViewInit {

  orders: any;
  displayedColumns: string[] = [
    'id',
    'code',
    'manager_name',
    'manager_phone',
    'staff_name',
    'staff_phone',
    'statu',
    'comment',
    'created_at',
    'action'
  ];

  isLoading: boolean = true;
  selectedIds: string[] = [];

  isDownloading = false;
  progress = 0;
  totalOrders = 0;
  private pdfService = inject(PdfService);

  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private readonly orderService: OrderService,
    private readonly sOrder: OrderWarehouseService,

  ) { }

  ngOnInit(): void {
    this.getOrders();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getOrders() {
    this.orderService.index().subscribe({
      next: (resp: any) => {
        this.dataSource = new MatTableDataSource(resp);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log('Error: ', err);
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  orderDelete(id: string) {
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
        this.orderService.delete(id).subscribe({
          next: (res) => {
            Swal.fire({
              title: 'Eliminado',
              text: 'El pedido ha sido eliminado con exito',
              icon: 'success',
              timer: 2000
            });
            this.getOrders();
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    });
  }

  onCheckboxChange(event: any, id: string): void {
    if (event.checked) {
      this.selectedIds.push(id);
    } else {
      const index = this.selectedIds.indexOf(id);
      if (index >= 0) {
        this.selectedIds.splice(index, 1);
      }
    }
  }
  downloadSelectedOrders(selectedIds: string[]): void {
    if (!selectedIds?.length) {
      this.showError('No hay órdenes seleccionadas');
      return;
    }

    this.isDownloading = true;
    this.totalOrders = selectedIds.length;
    this.progress = 0;

    this.sOrder.downloadMultipleOrders(selectedIds)
      .subscribe({
        next: () => {
          this.progress++;
        },
        error: (error) => {
          console.error('Error al descargar las órdenes:', error);
          this.showError('Error al descargar algunas órdenes');
          this.isDownloading = false;
        },
        complete: () => {
          this.showSuccess(`Se han descargado ${this.totalOrders} órdenes correctamente`);
          this.isDownloading = false;
          this.progress = 0;
        }
      });
  }

  expiredAll() {
    if (!this.selectedIds?.length) {
      this.showError('No hay órdenes seleccionadas');
      return;
    }
    try {

      Swal.fire({
        title: 'Confirmación',
        text: '¿Estás seguro de marcar como Expirada todas las órdenes seleccionadas?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, marcar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.sOrder.expiredAll(this.selectedIds).subscribe({
            next: (resp) => {
              this.showSuccess('Las órdenes han sido marcadas como Expirada con éxito');
              this.selectedIds = [];
              this.ngOnInit();
            },
            error: (error) => {
              console.error('Error al marcar como Expirada las órdenes:', error);
              this.showError(error.error.detail);
            }
          });
        }
      });

    } catch (error) {
      console.error('Error al marcar como Expiradas las órdenes:', error);
    }
  }
  private showError(message: string): void {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
    });
  }

  private showSuccess(message: string): void {
    Swal.fire({
      title: 'Éxito',
      text: message,
      icon: 'success',
    });
  }
}
