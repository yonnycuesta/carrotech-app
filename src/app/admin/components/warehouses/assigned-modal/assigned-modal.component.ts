import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { OrderWarehouseService } from '../../../services/order-warehouse.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assigned-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatSelectModule,
    MatSelect,
    MatIconModule,
    MatIcon
  ],
  templateUrl: './assigned-modal.component.html',
  styleUrl: './assigned-modal.component.scss'
})
export class AssignedModalComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<AssignedModalComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  ordersId: any;
  users: any;
  assignedId: string = '';

  constructor(private sUser: UserService,
    private sOrder: OrderWarehouseService
  ) {
    this.ordersId = this.data;
  }


  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    try {
      this.sUser.indexWarehousesStaff().subscribe({
        next: (response) => {
          this.users = response;
        },
        error: (error) => {
          console.error(error);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }


  onSave() {
    try {
      this.sOrder.assignedAll(this.assignedId, this.ordersId).subscribe({
        next: (resp: any) => {
          Swal.fire({
            title: 'Asignadas',
            text: resp.msg,
            icon: 'success',
          });
          this.dialogRef.close();
        },
        error: (error) => {
          console.error(error);
          Swal.fire({
            title: 'Error',
            text: 'Error al asignar las órdenes',
            icon: 'error',
            timer: 4000,
            confirmButtonText: "Entendido"
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  close() {
    this.assignedId = '';
    this.dialogRef.close(this.assignedId);
  }
}
