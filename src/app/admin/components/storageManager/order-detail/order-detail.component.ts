import { AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { OrderStoragaManagerService } from '../../../services/order-manager.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { timeout } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule, Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    MatExpansionModule
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit {

  order: any = {};

  orderId!: string;

  readonly panelOpenState = signal(false);
  readonly panelRejectedOpenState = signal(false);

  displayedColumns: string[] = ['item_name', 'item_code', 'item_qty', 'item_unit'];
  displayedRejectedColumns: string[] = ['item_name', 'item_qty', 'qty_delivered'];

  items: any;

  constructor(
    private readonly sOrder: OrderStoragaManagerService,
    private readonly _route: ActivatedRoute,
    private readonly _location: Location
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe({
      next: (params) => {
        this.orderId = params['id'];
        this.getDetails(this.orderId);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getDetails(id: string) {
    try {
      this.sOrder.getOrder(id).subscribe({
        next: (res: any) => {
          this.order = res;
        },
        error: (error: any) => {
          console.log('Error al obtener el detalle de la orden: ', error);
        }
      });
    } catch (error) {
      console.log('Error al obtener el detalle de la orden: ', error);
    }
  }

  goBack() {
    this._location.back();
  }
}
