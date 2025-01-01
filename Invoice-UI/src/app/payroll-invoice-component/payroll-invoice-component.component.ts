import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface PayrollData {
  id?: number;
  employeeName: string;
  employeeId: string;
  basicSalary: number;
  allowanceType: string;
  allowanceAmount: number;
  deductions: number;
  totalAmount: number;
}


@Component({
  selector: 'app-payroll-invoice-component',
  imports: [RouterModule, ReactiveFormsModule,CommonModule],
  templateUrl: './payroll-invoice-component.component.html',
  styleUrl: './payroll-invoice-component.component.css'
})
export class PayrollInvoiceComponentComponent implements OnInit {
  private apiUrl = 'http://localhost:8080/api/payroll';
  payrollForm!: FormGroup;
  allowanceTypes = ['Salary', 'Rent', 'Maintenance'];
  payrolls: PayrollData[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadPayrolls();
  }

  initializeForm() {
    this.payrollForm = this.fb.group({
      employeeName: ['', Validators.required],
      employeeId: ['', Validators.required],
      basicSalary: ['', [Validators.required, Validators.min(0)]],
      allowanceType: ['', Validators.required],
      allowanceAmount: ['', [Validators.required, Validators.min(0)]],
      deductions: ['', [Validators.required, Validators.min(0)]]
    });
  }

  loadPayrolls() {
    this.loading = true;
    this.http.get<PayrollData[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.payrolls = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load payrolls';
        this.loading = false;
        console.error('Error:', err);
      }
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

      this.http.post<PayrollData>(this.apiUrl, payrollData).subscribe({
        next: (response) => {
          this.successMessage = 'Payroll created successfully!';
          this.loading = false;
          this.initializeForm();
          this.loadPayrolls();
        },
        error: (err) => {
          this.errorMessage = 'Failed to create payroll';
          this.loading = false;
          console.error('Error:', err);
        }
      });
    }
  }

  deletePayroll(id: number) {
    if (confirm('Are you sure you want to delete this payroll?')) {
      this.loading = true;
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.successMessage = 'Payroll deleted successfully!';
          this.loadPayrolls();
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete payroll';
          this.loading = false;
          console.error('Error:', err);
        }
      });
    }
  }

  editPayroll(payroll: PayrollData) {
    this.payrollForm.patchValue({
      employeeName: payroll.employeeName,
      employeeId: payroll.employeeId,
      basicSalary: payroll.basicSalary,
      allowanceType: payroll.allowanceType,
      allowanceAmount: payroll.allowanceAmount,
      deductions: payroll.deductions
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.payrollForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}