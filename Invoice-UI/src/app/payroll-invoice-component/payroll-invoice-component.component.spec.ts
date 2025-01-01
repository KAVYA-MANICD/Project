import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollInvoiceComponentComponent } from './payroll-invoice-component.component';

describe('PayrollInvoiceComponentComponent', () => {
  let component: PayrollInvoiceComponentComponent;
  let fixture: ComponentFixture<PayrollInvoiceComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollInvoiceComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollInvoiceComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
