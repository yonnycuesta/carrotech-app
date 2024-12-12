import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBopenendComponent } from './order-bopenend.component';

describe('OrderBopenendComponent', () => {
  let component: OrderBopenendComponent;
  let fixture: ComponentFixture<OrderBopenendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderBopenendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderBopenendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
