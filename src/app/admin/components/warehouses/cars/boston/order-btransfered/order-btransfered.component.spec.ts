import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBtransferedComponent } from './order-btransfered.component';

describe('OrderBtransferedComponent', () => {
  let component: OrderBtransferedComponent;
  let fixture: ComponentFixture<OrderBtransferedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderBtransferedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderBtransferedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
