import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalInvoiceComponent } from './sal-invoice.component';

describe('SalInvoiceComponent', () => {
  let component: SalInvoiceComponent;
  let fixture: ComponentFixture<SalInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
