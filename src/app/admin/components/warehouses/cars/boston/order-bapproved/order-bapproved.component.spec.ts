import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBapprovedComponent } from './order-bapproved.component';

describe('OrderBapprovedComponent', () => {
  let component: OrderBapprovedComponent;
  let fixture: ComponentFixture<OrderBapprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderBapprovedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderBapprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
