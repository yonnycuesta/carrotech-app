import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLogComponent } from './auth-log.component';

describe('AuthLogComponent', () => {
  let component: AuthLogComponent;
  let fixture: ComponentFixture<AuthLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthLogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
