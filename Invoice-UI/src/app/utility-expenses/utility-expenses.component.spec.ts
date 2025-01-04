import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilityExpensesComponent } from './utility-expenses.component';

describe('UtilityExpensesComponent', () => {
  let component: UtilityExpensesComponent;
  let fixture: ComponentFixture<UtilityExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilityExpensesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilityExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
