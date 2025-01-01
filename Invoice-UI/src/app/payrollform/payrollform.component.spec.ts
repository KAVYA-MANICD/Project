import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollformComponent } from './payrollform.component';

describe('PayrollformComponent', () => {
  let component: PayrollformComponent;
  let fixture: ComponentFixture<PayrollformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
