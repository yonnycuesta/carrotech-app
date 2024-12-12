import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../home/services/auth/auth.service';
import { IOrderManager } from '../../../interfaces/order-manager.interface';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { ProgressComponent } from '../../../helpers/progress/progress.component';
import { OrderWarehouseService } from '../../../services/order-warehouse.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PdfService } from '../../../services/pdf.service';
import { AssignedModalComponent } from '../assigned-modal/assigned-modal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-order-list-wopenend',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
    MatDatepickerModule,
  ],
  templateUrl: './order-list-wopenend.component.html',
  styleUrl: './order-list-wopenend.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListWopenendComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['id', 'code', 'staff_name', 'staff_dni', 'shift', 'statu', 'zone',
    'delivered_opt', 'delivered_site',
    'created_at', 'action'];

  isFiltered = false;

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

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

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

  filtersApplied() {
    if (this.range.value.end === null || this.range.value.start === null) {
      Swal.fire({
        icon: 'info',
        title: 'Sin selección',
        text: 'Por favor, seleccione un rango de fechas válido para generar el reporte.',
        confirmButtonText: "Entendido"
      })
      return;
    }

  }

  cleanFilter() {
    this.range.reset();
    this.isFiltered = false;
    this.getOrders();
  }
  searchInRange() {
    if (this.range.value.end === null || this.range.value.start === null) {
      Swal.fire({
        icon: 'info',
        title: 'Sin selección',
        text: 'Por favor, seleccione un rango de fechas válido para realizar la búsqueda.',
        confirmButtonText: "Entendido"
      });
      this.isFiltered = false;
      return;
    }
    this.isFiltered = true;

    this.getOrders();
  }
  getOrders() {
    try {
      this.dataSource.data = [];
      if (!this.isFiltered) {
        this.sOrder.openends().subscribe({
          next: (resp: any) => {
            this.dataSource.data = this.sortByShift(resp);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.isLoading = false;
          },
          error: (err: any) => {
            console.log('Error: ', err);
            this.isLoading = false;
            this.handleError(err);
          }
        });
      } else {
        const end = this.formatDate(this.range.value.end);
        const start = this.formatDate(this.range.value.start);

        this.sOrder.openendsWithFilters(start, end).subscribe({
          next: (resp: any) => {
            this.dataSource.data = this.sortByShift(resp);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.isLoading = false;
          },
          error: (err: any) => {
            console.log('Error: ', err);
            this.isLoading = false;
            this.handleError(err);
          }
        });
      }
    } catch (error) {
      console.log('Error al obtener las ordenes: ', error);
    }
  }

  formatDate(date: Date | null | undefined): string {
    if (date) {
      return date.toISOString().split('T')[0];
    } else {
      return '';
    }
  }
  private sortByShift(data: any[]): any[] {
    return data.sort((a, b) => a.shift - b.shift);
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



  asignedAll() {
    if (!this.selectedIds?.length) {
      this.showError('No hay órdenes seleccionadas');
      return;
    }

    this.dialog.open(AssignedModalComponent, {
      data: this.selectedIds
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

}
