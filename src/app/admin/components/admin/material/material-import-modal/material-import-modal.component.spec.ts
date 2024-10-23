import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialImportModalComponent } from './material-import-modal.component';

describe('MaterialImportModalComponent', () => {
  let component: MaterialImportModalComponent;
  let fixture: ComponentFixture<MaterialImportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialImportModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaterialImportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
