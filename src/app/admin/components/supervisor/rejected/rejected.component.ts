import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ProgressComponent } from '../../../helpers/progress/progress.component';
import Swal from 'sweetalert2';
import { OrderSupervisorService } from '../../../services/order-supervisor.service';
import { IOrderManager } from '../../../interfaces/order-manager.interface';
import { OrderStoragaManagerService } from '../../../services/order-manager.service';
import { HelperService } from '../../../services/helper.service';

@Component({
  selector: 'app-rejected',
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
    ProgressComponent
  ],
  templateUrl: './rejected.component.html',
  styleUrl: './rejected.component.scss'
})
export class RejectedComponent implements AfterViewInit, OnInit {


  displayedColumns: string[] = ['code', 'user_name', 'user_phone', 'manager_name', 'delivered_opt',
    'created_at', 'action'];

  dataSource = new MatTableDataSource<IOrderManager>();

  isLoading: boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private readonly sOrder: OrderSupervisorService,
    private readonly _helpService: HelperService
  ) {
  }


  ngOnInit() {
    this.getOrders();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getOrders() {
    try {
      this.sOrder.indexRejected().subscribe({
        next: (resp: any) => {
          this.dataSource.data = resp;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

  downladItems(managerId: string, order_number: string) {
    try {
      this._helpService.downloadItems(managerId, order_number).subscribe({
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
}
