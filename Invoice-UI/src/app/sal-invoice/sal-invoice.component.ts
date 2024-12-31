import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sal-invoice',
  imports: [RouterModule,CommonModule,ReactiveFormsModule],
  templateUrl: './sal-invoice.component.html',
  styleUrl: './sal-invoice.component.css'
})
export class SalInvoiceComponent implements OnInit {
  invoiceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.invoiceForm = this.fb.group({
      employeeName: ['', Validators.required],
      employeeId: ['', Validators.required],
      basicSalary: ['', [Validators.required, Validators.min(0)]],
      allowances: ['', [Validators.required, Validators.min(0)]],
      deductions: ['', [Validators.required, Validators.min(0)]],
      paymentDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      const invoiceData = {
        ...this.invoiceForm.value,
        totalSalary: 
          this.invoiceForm.value.basicSalary + 
          this.invoiceForm.value.allowances - 
          this.invoiceForm.value.deductions
      };

      this.http.post('http://localhost:8080/api/admin/invoice/generate', invoiceData)
        .subscribe(
          (response: any) => {
            alert('Invoice generated successfully!');
            this.invoiceForm.reset();
          },
          (error) => {
            alert('Error generating invoice: ' + error.message);
          }
        );
    }
  }

  downloadCSV(): void {
    this.http.get('http://localhost:8080/api/admin/invoice/download', { responseType: 'blob' })
      .subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `salary_invoice_${new Date().getTime()}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      });
  }

}
