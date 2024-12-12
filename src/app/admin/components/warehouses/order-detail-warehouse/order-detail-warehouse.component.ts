import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderStoragaManagerService } from '../../../services/order-manager.service';
import { OrderWarehouseService } from '../../../services/order-warehouse.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { ProgressComponent } from '../../../helpers/progress/progress.component';

@Component({
  selector: 'app-order-detail-warehouse',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    MatExpansionModule,
    ProgressComponent
  ],
  templateUrl: './order-detail-warehouse.component.html',
  styleUrl: './order-detail-warehouse.component.scss'
})
export class OrderDetailWarehouseComponent implements OnInit {

  order: any = {};

  orderId!: string;
  isLoading: boolean = true;

  readonly panelOpenState = signal(false);
  readonly panelRejectedOpenState = signal(false);

  displayedColumns: string[] = ['item_name', 'item_code', 'item_qty', 'item_unit'];
  displayedRejectedColumns: string[] = ['item_name', 'item_qty', 'qty_delivered'];

  constructor(
    private readonly sOrder: OrderWarehouseService,
    private readonly _route: ActivatedRoute
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
      this.sOrder.show(id).subscribe({
        next: (res: any) => {
          this.order = res;
          this.isLoading = false;
        },
        error: (error: any) => {
          this.isLoading = false;
          console.log('Error al obtener el detalle de la orden: ', error);
        }
      });
    } catch (error) {
      this.isLoading = false;
      console.log('Error al obtener el detalle de la orden: ', error);
    }
  }

  goBack() {
    window.history.back();
  }

}
