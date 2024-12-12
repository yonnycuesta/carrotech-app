import { AfterViewInit, Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../../home/services/auth/auth.service';
import { IOrderManager } from '../../../../interfaces/order-manager.interface';
import { HelperService } from '../../../../services/helper.service';
import { OrderStoragaManagerService } from '../../../../services/order-manager.service';
import { OrderStatuComponent } from '../../../orders/order-statu/order-statu.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { ProgressComponent } from '../../../../helpers/progress/progress.component';
import { OrderWarehouseService } from '../../../../services/order-warehouse.service';
import { PdfService } from '../../../../services/pdf.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-order-list-received',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatLabel,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatMenuModule,
    MatMenu,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatIconButton,
    RouterModule,
    ProgressComponent,
    MatCheckboxModule
  ],
  templateUrl: './order-list-received.component.html',
  styleUrl: './order-list-received.component.scss'
})
export class OrderListReceivedComponent implements AfterViewInit, OnInit {


  displayedColumns: string[] = ['id', 'code', 'staff_name', 'shift', 'statu',
    'comment', 'delivered_opt', 'mocode',
    'created_at', 'action'];

  dataSource = new MatTableDataSource<IOrderManager>();
  private authService = inject(AuthService);

  private _route = inject(ActivatedRoute);

  public user = computed(() => this.authService.currentUser());
  managerId: any = '';

  isLoading: boolean = true;

  isDownloading = false;
  progress = 0;
  totalOrders = 0;
  selectedIds: string[] = [];
  private pdfService = inject(PdfService);


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private readonly sOrderMang: OrderStoragaManagerService,
    private readonly _helpService: HelperService,
    private readonly sOrder: OrderWarehouseService

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
      this.sOrderMang.indexReceivend(this.managerId).subscribe({
        next: (resp: any) => {
          this.dataSource.data = resp.sort((a: any, b: any) => a.shift - b.shift);
          this.isLoading = false;
        },
        error: (err: any) => {
          console.log('Error: ', err);
          this.isLoading = false;
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


  updateStatu(order: any) {
    const dialogRef = this.dialog.open(OrderStatuComponent, {
      data: {
        order_id: order.id,
        statu: order.statu
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const action = result.data['action'];
        delete result.data['action'];

        if (action == "Actualizar") {
          Swal.fire({
            title: 'Orden actualizada',
            text: 'La orden ha sido actualizada con éxito',
            icon: 'success',
            timer: 2000
          });
          this.getOrders();
        }
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





  // TODO:: Do something
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

  private handleError(error: any): void {
    if (error.status === 404) {
      Swal.fire({
        title: 'Sin ordenes',
        text: error.error.detail,
        confirmButtonText: "Entendido"
      });
    } else {
      console.error('Error al cargar datos del almacén:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar los datos del carro bodega'
      });
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

  downloadOrder(id: string) {
    try {
      this.sOrder.exportItem(id).subscribe({
        next: (resp) => {
          this.pdfService.generateOrderPDFPreview(resp);
        },
        error: (error) => {
          console.error('Error al descargar la orden:', error);
          this.showError(error.error.detail);
        }
      });
    } catch (error) {
      console.error('Error al descargar la orden:', error);
    }
  }
  approvedAll() {
    if (!this.selectedIds?.length) {
      this.showError('No hay órdenes seleccionadas');
      return;
    }
    try {

      Swal.fire({
        title: 'Confirmación',
        text: '¿Estás seguro de aprobar todas las órdenes seleccionadas?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, aprobar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(this.selectedIds);
          this.sOrder.approvedAll(this.selectedIds).subscribe({
            next: (resp) => {
              this.showSuccess('Las órdenes han sido aprobadas con éxito');
              this.selectedIds = [];
              this.ngOnInit();
            },
            error: (error) => {
              console.error('Error al aprobar las órdenes:', error);
              this.showError(error.error.detail);
            }
          });
        }
      });

    } catch (error) {
      console.error('Error al aprobar las órdenes:', error);
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





}
