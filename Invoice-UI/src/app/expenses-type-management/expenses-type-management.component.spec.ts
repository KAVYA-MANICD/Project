import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesTypeManagementComponent } from './expenses-type-management.component';

describe('ExpensesTypeManagementComponent', () => {
  let component: ExpensesTypeManagementComponent;
  let fixture: ComponentFixture<ExpensesTypeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesTypeManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesTypeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
