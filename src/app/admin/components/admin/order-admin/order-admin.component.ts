import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
    MatIconButton
  ],
  templateUrl: './order-admin.component.html',
  styleUrl: './order-admin.component.scss'
})
export class OrderAdminComponent implements OnInit, AfterViewInit {

  orders: any;
  displayedColumns: string[] = [
    'code',
    'manager_name',
    'manager_phone',
    'staff_name',
    'staff_phone',
    'statu',
    'calendar',
    'comment',
    'created_at',
    'action'
  ];

  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private readonly orderService: OrderService
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

  orderDelete(id: string){
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
}
