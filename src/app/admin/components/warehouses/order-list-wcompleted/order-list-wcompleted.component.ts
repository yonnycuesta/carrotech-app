import { AfterViewInit, Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../home/services/auth/auth.service';
import { IOrderManager } from '../../../interfaces/order-manager.interface';
import { OrderWarehouseService } from '../../../services/order-warehouse.service';
import { PdfService } from '../../../services/pdf.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { ProgressComponent } from '../../../helpers/progress/progress.component';

@Component({
  selector: 'app-order-list-wcompleted',
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
  templateUrl: './order-list-wcompleted.component.html',
  styleUrl: './order-list-wcompleted.component.scss'
})
export class OrderListWcompletedComponent implements AfterViewInit, OnInit {


  displayedColumns: string[] = ['id', 'code', 'staff_name', 'staff_dni', 'shift', 'statu', 'zone',
    'delivered_opt', 'delivered_site', 'mocode',
    'created_at', 'action'];

  dataSource = new MatTableDataSource<IOrderManager>();
  private authService = inject(AuthService);

  private _route = inject(ActivatedRoute);

  public user = computed(() => this.authService.currentUser());
  managerId: any = '';

  isLoading: boolean = true;
  selectedIds: string[] = [];

  isDownloading = false;
  progress = 0;
  totalOrders = 0;
  private pdfService = inject(PdfService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private readonly sOrder: OrderWarehouseService,
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
      this.sOrder.completeds().subscribe({
        next: (resp: any) => {
          this.dataSource.data = resp.sort((a: any, b: any) => a.shift - b.shift);
          this.isLoading = false;
        },
        error: (err: any) => {
          console.log('Error: ', err);
          this.isLoading = false;
          this.handleError(err);
        }
      });
    } catch (error) {
      this.handleError(error);
      console.log('Error al obtener las ordenes: ', error);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

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

  private handleError(error: any): void {
    if (error.error?.detail) {
      const cleanMessage = error.error.detail.replace('404: ', '');
      Swal.fire({
        title: 'Sin ordenes',
        text: cleanMessage,
        confirmButtonText: "Entendido"
      });
    } else {
      console.error('Error al cargar datos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar los datos del almacén'
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

  consolidateSelectedOrders() {

    if (!this.selectedIds?.length) {
      this.showError('No hay órdenes seleccionadas');
      return;
    }

    Swal.fire({
      title: 'Confirmación',
      text: '¿Estás seguro de Enviar al ÁREA DE CONSOLIDACIÓN las órdenes seleccionadas?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.sOrder.consolidatedAll(this.selectedIds).subscribe({
          next: (resp) => {
            this.showSuccess('Las Órdenes enviadas al Área de consolidación exitosamente');
            this.selectedIds = [];
            this.ngOnInit();
          },
          error: (error) => {
            console.error('Error al consolidar las órdenes:', error);
            this.showError(error.error.detail);
          }
        });
      }
    });
  }

}
