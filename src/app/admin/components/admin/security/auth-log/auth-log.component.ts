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
import { IAuthLogs } from '../../../../interfaces/security.interface';
import { SecurityService } from '../../../../services/security.service';
import { ProgressComponent } from '../../../../helpers/progress/progress.component';

const ELEMENT_DATA: IAuthLogs[] = [];

@Component({
  selector: 'app-auth-log',
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
    RouterModule,
    ProgressComponent
  ],
  templateUrl: './auth-log.component.html',
  styleUrl: './auth-log.component.scss'
})
export class AuthLogComponent implements OnInit, AfterViewInit {

  orders: any;
  displayedColumns: string[] = [
    'user_name',
    'location',
    'browser_info',
    'ip_address',
    'created_at'
  ];
  isLoading: boolean = true;

  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly sSecurity: SecurityService
  ) { }

  ngOnInit(): void {
    this.getData();
  }


  getData() {

    try {
      this.sSecurity.accessLogs().subscribe({
        next: (res) => {
          this.dataSource.data = res;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error(error);
      this.isLoading = false;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
