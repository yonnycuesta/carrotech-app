import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBpreparedComponent } from './order-bprepared.component';

describe('OrderBpreparedComponent', () => {
  let component: OrderBpreparedComponent;
  let fixture: ComponentFixture<OrderBpreparedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderBpreparedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderBpreparedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
