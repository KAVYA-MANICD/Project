import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PayrollService } from '../payroll.service';
import { PayrollData } from '../models/payroll.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-payrollform',
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './payrollform.component.html',
  styleUrl: './payrollform.component.css'
})
export class PayrollformComponent implements OnInit {
  logout(){
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('loginUser');
    this.router.navigate(['/login']);
  }

  payrollForm!: FormGroup;
  
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private payrollService: PayrollService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.payrollForm = this.fb.group({
      employeeName: ['', Validators.required],
      employeeId: ['', Validators.required],
      basicSalary: ['', [Validators.required, Validators.min(0)]],

      allowanceAmount: ['', [Validators.required, Validators.min(0)]],
      deductions: ['', [Validators.required, Validators.min(0)]]
    });
  }

  calculateTotal(): number {
    if (this.payrollForm.valid) {
      const values = this.payrollForm.value;
      return Number(values.basicSalary) + Number(values.allowanceAmount) - Number(values.deductions);
    }
    return 0;
  }

  

  onSubmit() {
    if (this.payrollForm.valid) {
      this.loading = true;
      const payrollData: PayrollData = {
        ...this.payrollForm.value,
        totalAmount: this.calculateTotal()
      };
  
      console.log('Sending payroll data:', payrollData); // Log the data to verify
  
      this.payrollService.createPayroll(payrollData).subscribe({
        next: (response) => {
          this.successMessage = `Payroll created successfully! Invoice Number: ${response.invoiceNumber}`;
          this.router.navigate(['/payrolllist']);
          this.loading = false;
          this.initializeForm();
        },
        error: (err) => {
          this.errorMessage = 'Failed to create payroll';
          this.loading = false;
          console.error('Error:', err);
        }
      });
    }
  }
  



  isFieldInvalid(fieldName: string): boolean {
    const field = this.payrollForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

}
