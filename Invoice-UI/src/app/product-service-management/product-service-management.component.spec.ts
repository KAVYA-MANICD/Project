import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductServiceManagementComponent } from './product-service-management.component';

describe('ProductServiceManagementComponent', () => {
  let component: ProductServiceManagementComponent;
  let fixture: ComponentFixture<ProductServiceManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ProductServiceManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductServiceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
