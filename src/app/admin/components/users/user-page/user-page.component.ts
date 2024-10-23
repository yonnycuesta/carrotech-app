import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../../services/alert.service';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatLabel } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { animate, query, style, transition, trigger } from '@angular/animations';
import { IUser, IUserDisplayColumn } from '../../../../home/interfaces/users/user-page.interface';
import { UserFormComponent } from '../user-form/user-form.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgToastModule, NgToastService, ToasterPosition } from 'ng-angular-popup';
import { ProgressComponent } from '../../../helpers/progress/progress.component';


@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, MatTableModule, ProgressComponent, ReactiveFormsModule, MatInputModule, MatButtonModule, MatTooltipModule,
    FormsModule, MatPaginatorModule, MatLabel, MatSelectModule, MatFormFieldModule, MatCheckboxModule,NgToastModule,
    MatMenuModule, MatOptionModule, MatProgressSpinnerModule, MatIconModule, MatCardModule],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss',
  animations: [
    trigger('animation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ transform: 'translateX(100%)', opacity: 0 }),
            animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
          ],
          { optional: true }
        ),
        query(
          ':leave',
          [
            style({ transform: 'translateX(0)', opacity: 1 }),
            animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
          ],
          {
            optional: true
          }
        )
      ])
    ])
  ]
})
export class UserPageComponent implements OnInit {

  ToasterPosition = ToasterPosition;
  toast = inject(NgToastService);


  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ELEMENT_DATA!: IUser[];
  dataSource = new MatTableDataSource<IUser>(this.ELEMENT_DATA);
  selection!: SelectionModel<IUser>;
  add: string = 'Agregar';
  edit: string = 'Editar';
  delete: string = 'Eliminar';
  value: string = '';
  isLoading: boolean = true;

  displayedColumns: IUserDisplayColumn[] = [
    { def: 'name', label: 'Nombre', hide: false },
    { def: 'dni', label: 'Cédula', hide: false },
    { def: 'email', label: 'Correo Electrónico', hide: false },
    { def: 'phone', label: 'Celular', hide: false },
    { def: 'role', label: 'Rol', hide: false },
    { def: 'statu', label: 'Estado', hide: false },
    { def: 'action', label: 'Acciones', hide: false }
  ];

  disColumns!: string[];

  checkBoxList: IUserDisplayColumn[] = [];


  constructor(
    public userService: UserService,
    public dialog: MatDialog,
    private alertService: AlertService,
  ) {

  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.selection = new SelectionModel<IUser>(true, []);
    this.disColumns = this.displayedColumns.map(cd => cd.def)
    this.getUsers();
  }




  getUsers() {
    this.userService.index().subscribe({
      next: (resp) => {
        this.isLoading = false;
        this.dataSource.data = resp;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log('Error: ', err);
      }
    });
  }

  applyFilter(event: any): void {
    const filterValue = event.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  openAddEditDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(UserFormComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        const action = result.data['action'];
        delete result.data['action'];
        if (action == this.add) {
          this.toast.success('Usuario agregado correctamente');
          this.getUsers();
        } else if (action == this.edit) {
          this.toast.success('Usuario actualizado correctamente');
          this.getUsers();
        }
      }
    });
  }

  // This function will be called when user click on select all check-box
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }



  // Add a row into to data table
  addRowData(row_obj: any): void {
    const data = this.dataSource.data
    data.push(row_obj);
    this.dataSource.data = data;
  }


  // Open confirmation dialog
  openDeleteDialog(obj: any): void {
    const options = {
      title: 'Eliminar?',
      message: `Estás seguro de eliminar el registro?`,
      cancelText: 'NO',
      confirmText: 'SI',
    };

    this.alertService.open(options);
    this.alertService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.userService.delete(obj.id).subscribe({
          next: (resp) => {
            this.toast.success('Usuario eliminado correctamente');
            this.getUsers();
          },
          error: (err) => {
            console.log('Error: ', err);
          }
        });
      }
    });
  }

  // Show/Hide check boxes
  showCheckBoxes(): void {
    this.checkBoxList = this.displayedColumns;
  }

  hideCheckBoxes(): void {
    this.checkBoxList = [];
  }

  toggleForm(): void {
    this.checkBoxList.length ? this.hideCheckBoxes() : this.showCheckBoxes();
  }

  // Show/Hide columns
  hideColumn(event: any, item: string) {
    this.displayedColumns.forEach(element => {
      if (element['def'] == item) {
        element['hide'] = event.checked;
      }
    });
    this.disColumns = this.displayedColumns.filter(cd => !cd.hide).map(cd => cd.def)
  }

}
