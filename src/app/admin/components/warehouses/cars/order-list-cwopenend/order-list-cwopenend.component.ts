import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { OrderWarehouseService } from '../../../../services/order-warehouse.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenu, transformMenu } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ProgressComponent } from '../../../../helpers/progress/progress.component';
import { IOrderManager } from '../../../../interfaces/order-manager.interface';
import { catchError, finalize, of } from 'rxjs';
import { PdfService } from '../../../../services/pdf.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
@Component({
  selector: 'app-order-list-cwopenend',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
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
    MatCheckboxModule,
  ],
  templateUrl: './order-list-cwopenend.component.html',
  styleUrl: './order-list-cwopenend.component.scss',
})
export class OrderListCwopenendComponent implements OnInit, AfterViewInit {
  warehousescar: any;
  displayedColumns: string[] = ['id', 'code', 'staff_name', 'staff_dni', 'shift', 'statu',
    'delivered_opt', 'delivered_site',
    'created_at', 'action'];
  selectedIds: string[] = [];
  isLoading: boolean = false;

  isDownloading = false;
  progress = 0;
  totalOrders = 0;

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private pdfService = inject(PdfService);

  constructor(
    private readonly sUser: UserService,
    private readonly sOrder: OrderWarehouseService,
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit(): void {
    this.getWarehouses();
  }

  ngAfterViewInit() {
    this.initializeDataSource();
  }

  private initializeDataSource(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchStr = filter.toLowerCase();
      return Object.keys(data).some(key => {
        const value = data[key];
        return value && value.toString().toLowerCase().includes(searchStr);
      });
    };
  }
  private setupDataSourceAttributes(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchStr = filter.toLowerCase();
      return Object.keys(data).some(key => {
        const value = data[key];
        return value && value.toString().toLowerCase().includes(searchStr);
      });
    };
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

  getWarehouses() {
    try {
      this.sUser.indexStorageManagers().subscribe({
        next: (response) => {
          this.warehousescar = response;
        },
        error: (error) => {
          console.error(error);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }


  onTabChange(event: MatTabChangeEvent): void {
    const selectedWarehouse = this.warehousescar[event.index];

    console.log(selectedWarehouse);

    if (!selectedWarehouse?.id) {
      this.showError('No se ha seleccionado un Carro Bodega');
      return;
    }

    this.loadWarehouseData(selectedWarehouse.id);
  }


  canApproveOrder(element: any): boolean {
    if (element.statu === 'approved' || element.statu === 'completed') {
      return true;
    }

    const previousOrders = this.dataSource.data.filter(order => order.shift < element.shift);
    return previousOrders.every(order =>
      order.statu === 'approved' || order.statu === 'completed'
    );
  }


  private loadWarehouseData(warehouseId: string | number): void {
    this.isLoading = true;
    this.dataSource = new MatTableDataSource<any>([]);

    this.sOrder.indexCarOpened(warehouseId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.setupDataSourceAttributes();
        }),
        catchError(error => {
          this.handleError(error);
          return of([]);
        })
      )
      .subscribe(response => {
        if (response) {
          const sortedData = this.sortByShift(response);
          this.dataSource.data = sortedData;
        }
      });
  }

  private sortByShift(data: any[]): any[] {
    return data.sort((a, b) => a.shift - b.shift);
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

  asignedAll() {

  }


  assignedTo(id: string) {

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

