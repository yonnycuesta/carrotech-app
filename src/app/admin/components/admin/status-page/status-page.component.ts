import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { HelperService } from '../../../services/helper.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MaterialImportModalComponent } from '../material/material-import-modal/material-import-modal.component';
import { StatusFormModalComponent } from './status-form-modal/status-form-modal.component';

interface IStatu {
  spanish_name: string;
  english_name: string;
}

const ELEMENT_DATA: IStatu[] = [];

@Component({
  selector: 'app-status-page',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatMenu,
    MatOptionModule,
    MatIconButton,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './status-page.component.html',
  styleUrl: './status-page.component.scss'
})
export class StatusPageComponent implements OnInit, AfterViewInit {


  displayedColumns: string[] = [
    'spanish_name',
    'english_name',
    'created_at',
    'action'
  ];
  add: string = 'Agregar';
  edit: string = 'Editar';
  delete: string = 'Eliminar';
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly sOrder: OrderService,
    private readonly sHelper: HelperService,
    public dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAll() {
    try {
      this.sOrder.indexStatus().subscribe({
        next: (res: any) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (error) => {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDelete(id: string) {
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
        this.sOrder.deleteStatus(id).subscribe({
          next: (res) => {
            this.sHelper.successMessage('success', 'Estado eliminado con exito');
            this.getAll();
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
    });
  }

  openImport(): void {
    const dialogRef = this.dialog.open(MaterialImportModalComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.getAll();
      }
    });
  }

  openAddEditDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(StatusFormModalComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        const action = result.data['action'];
        delete result.data['action'];
        if (action == this.add) {
          // this.toast.success('Usuario agregado correctamente');
          this.getAll();
        } else if (action == this.edit) {
          // this.toast.success('Usuario actualizado correctamente');
          this.getAll();
        }
      }
    });
  }

}
